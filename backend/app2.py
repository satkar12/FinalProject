
import streamlit as st
from dotenv import load_dotenv
from PyPDF2 import PdfReader
import io
from langchain.text_splitter import CharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings,ChatGoogleGenerativeAI
from langchain.vectorstores import FAISS
from langchain.memory import ConversationBufferMemory

from langchain.chains import ConversationalRetrievalChain
from htmlTemplate import css, bot_template, user_template


# === PDF TEXT EXTRACTION === #
def get_pdf_text(pdf_docs):
    text = ""
    for pdf in pdf_docs:
        pdf_reader = PdfReader(io.BytesIO(pdf.read()))
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text

# === CHUNKING FUNCTION === #
def get_text_chunks(raw_text):
    text_splitter = CharacterTextSplitter(
        separator="\n",
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_text(raw_text)
    return chunks


def get_vectorstore(text_chunks):
    embeddings =GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")
    vectorstore = FAISS.from_texts(texts=text_chunks, embedding=embeddings)
    return vectorstore



def get_conversation_chain(vectorstore):
    llm = ChatGoogleGenerativeAI(model="gemini-embedding-001")
    memory = ConversationBufferMemory(memory_key='chat_history', return_messages=True)
    conversation_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vectorstore.as_retriever(), 
        memory=memory
        )
    return conversation_chain

def handle_userinput(user_question):
    response = st.session_state.conversation({"question" : user_question})
    st.write(response)

# === MAIN APP === #
def main():
    load_dotenv()

    st.set_page_config(page_title="Quick Prep", page_icon="📘", layout="wide")
    st.write(css, unsafe_allow_html=True)


    if "conversation" not in st.session_state:
        st.session_state.conversation = None


    st.header("Chat with multiple PDF document :books:")    


    user_question = st.text_input("Ask a question about your documents...", placeholder="Type your question here...")   
    if user_question:
        handle_userinput(user_question) 


    st.write(  user_template.replace("{{MSG}}", user_question), unsafe_allow_html=True)
    st.write(  bot_template.replace("{{MSG}}", "I'm thinking..."), unsafe_allow_html=True)   

    # --- SIDEBAR --- #
    with st.sidebar:
       st.subheader("Your Documents")

       pdf_docs = st.file_uploader("Upload your PDFs here and click on 'Process'", accept_multiple_files=True)
       if st.button("Process"):
           with st.spinner("Processing..."):
               # get pdf text
               raw_text = get_pdf_text(pdf_docs)

               # get the text chunks
               text_chunks = get_text_chunks(raw_text)

               # create vector store
               vectorstore = get_vectorstore(text_chunks)

               # create conversation chain
               st.session_state.conversation = get_conversation_chain(vectorstore)
               # st.write(  bot_template.replace("{{MSG}}", "I'm ready! Ask me anything about your documents."), unsafe_allow_html=True)   
               st.success("Processing complete! You can now ask questions about your documents.")
    st.session_state.conversation
                    

    # --- BUTTONS --- #
   

if __name__=="__main__":
    main()

