import io
import streamlit as st
from dotenv import load_dotenv
from PyPDF2 import PdfReader

from langchain_text_splitters import CharacterTextSplitter
from langchain_ollama import OllamaEmbeddings, ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.vectorstores import FAISS

import pytesseract
from PIL import Image
from pdf2image import convert_from_bytes


# -------- PDF TEXT + OCR --------
def extract_text_from_pdf(pdf_file):
    try:
        pdf_bytes = pdf_file.read()
        pdf_reader = PdfReader(io.BytesIO(pdf_bytes))
        text = ""

        for page_num, page in enumerate(pdf_reader.pages, start=1):
            page_text = page.extract_text()
            if page_text and page_text.strip():
                text += page_text + "\n"
            else:
                # OCR fallback for scanned page
                images = convert_from_bytes(
                    pdf_bytes, first_page=page_num, last_page=page_num
                )
                for img in images:
                    text += pytesseract.image_to_string(img) + "\n"

        return text
    except Exception as e:
        st.error(f"Failed to extract text: {e}")
        return ""


# -------- CHUNKING --------
def chunk_text(raw_text: str):
    splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=500,
        chunk_overlap=100,
        length_function=len,
    )
    return splitter.split_text(raw_text)


# -------- VECTOR STORE --------
def create_vectorstore(chunks):
    embeddings = OllamaEmbeddings(model="mxbai-embed-large")
    return FAISS.from_texts(texts=chunks, embedding=embeddings)


# -------- SIMPLE RAG CHAIN (NO DEPRECATED chains API) --------
def create_conversation_chain(vectorstore):
    llm = ChatOllama(model="llama3.2", temperature=0)

    prompt = ChatPromptTemplate.from_template(
        "You are a helpful assistant. Use the following context to answer the question.\n\n"
        "Context:\n{context}\n\n"
        "Question: {question}"
    )

    retriever = vectorstore.as_retriever()

    def conversation(question: str):
        docs = retriever.invoke(question)
        context = "\n\n".join(d.page_content for d in docs)
        formatted = prompt.format(context=context, question=question)
        result = llm.invoke(formatted)
        answer = result.content if hasattr(result, "content") else str(result)
        return {"answer": answer}

    return conversation


# -------- HANDLE USER QUESTION --------
def handle_question(user_question: str):
    if "messages" not in st.session_state:
        st.session_state.messages = []

    response = st.session_state.conversation(user_question)
    answer = response["answer"]

    st.session_state.messages.append({"role": "user", "content": user_question})
    st.session_state.messages.append({"role": "assistant", "content": answer})

    # Re-render chat
    for message in st.session_state.messages:
        st.chat_message(message["role"]).markdown(message["content"])


# -------- STREAMLIT APP --------
def main():
    load_dotenv()
    st.set_page_config(page_title="QuickPrep PDF Chat", page_icon="📘", layout="wide")
    st.title("Chat with your PDFs 📘")

    if "conversation" not in st.session_state:
        st.session_state.conversation = None
    if "messages" not in st.session_state:
        st.session_state.messages = []

    # Sidebar for uploading PDFs
    with st.sidebar:
        st.subheader("Upload PDFs")
        pdf_files = st.file_uploader("Upload PDFs", accept_multiple_files=True)
        if st.button("Process PDFs") and pdf_files:
            with st.spinner("Processing PDFs..."):
                all_text = ""
                for pdf in pdf_files:
                    all_text += extract_text_from_pdf(pdf) + "\n"

                if not all_text.strip():
                    st.error("No text could be extracted from the uploaded PDFs.")
                else:
                    chunks = chunk_text(all_text)
                    vectorstore = create_vectorstore(chunks)
                    st.session_state.conversation = create_conversation_chain(vectorstore)
                    st.session_state.messages = []
                    st.success("PDFs processed! You can now ask questions.")

    # Main chat area
    if st.session_state.conversation:
        for message in st.session_state.messages:
            st.chat_message(message["role"]).markdown(message["content"])

        prompt = st.chat_input("Ask a question about your PDFs:")
        if prompt:
            with st.chat_message("user"):
                st.markdown(prompt)
            with st.chat_message("assistant"):
                with st.spinner("Thinking..."):
                    handle_question(prompt)
    else:
        st.info("👈 Upload and process PDFs first using the sidebar.")


if __name__ == "__main__":
    main()
