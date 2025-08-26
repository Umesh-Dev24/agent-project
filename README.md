# 🤖 Agentic AI System

An **Advanced AI Agent** with **Multi-Step Task Handling**, built using **React + TypeScript + Vite**.  
This project demonstrates how to build an **agentic AI system** capable of executing **multi-step queries** with integrated tools such as a **translator**, **calculator**, and **query parser**, while providing a clean and modern UI.

---

## 🚀 Features

- 🧠 **Agent Engine** – Handles multi-step reasoning and task execution.  
- 🔄 **Tool Integration** – Translator, calculator, and custom tools included.  
- 📊 **Execution Display** – Real-time visualization of the execution process.  
- 📜 **History Panel** – Track past queries and results.  
- 🎨 **Modern UI** – Built with React + Tailwind CSS.  

---

## 📂 Project Structure
src/
├── types/agent.ts              # Agent types and interfaces
├── tools/
│    ├── translator.ts          # Translation tool
│    ├── calculator.ts          # Calculator tool
├── utils/
│    ├── queryParser.ts         # Query parsing logic
│    ├── llmResponses.ts        # LLM response utilities
├── components/
│    ├── AgentInterface.tsx     # Main agent interface
│    ├── AgentEngine.tsx        # Core agent engine
│    ├── ExecutionDisplay.tsx   # Execution visualization
│    ├── HistoryPanel.tsx       # Query history panel
├── App.tsx                     # Main app entry
├── index.css                   # Global styles
├── main.tsx                    # App bootstrap

---

## ⚡ Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Umesh-Dev24/agent-project.git
cd agent-project
Install dependencies
bash -npm install
bash -npm run dev
