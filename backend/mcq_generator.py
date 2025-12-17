from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate

llm = ChatOllama(
    model="llama3.2",
    temperature=0.3
)

PROMPT = ChatPromptTemplate.from_messages([
    ("system", "You generate exam-level MCQs."),
    ("human", """
Generate 10 MCQs from the content below.

Rules:
- 4 options (A, B, C, D)
- One correct answer
- Output ONLY valid JSON
- No explanations

JSON format:
[
  {{
    "question": "...",
    "options": {{
      "A": "...",
      "B": "...",
      "C": "...",
      "D": "..."
    }},
    "answer": "A"
  }}
]

Content:
{content}
""")
])

def generate_mcqs(text: str):
    chain = PROMPT | llm
    response = chain.invoke({"content": text[:6000]})
    return response.content
