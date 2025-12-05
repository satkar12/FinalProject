const AskMe = () => {
    return (
        <div className="w-full h-screen">
            <iframe
                src="http://localhost:8501"
                style={{ width: "100%", height: "100%", border: "none" }}
                title="Ask Me"
            />
        </div>
    );
};

export default AskMe;
