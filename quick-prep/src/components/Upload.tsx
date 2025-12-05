import { useAuth } from "@/hooks/useAuth";
import { uploadResource } from "@/lib/resourceService";

const Upload = () => {
    const { user } = useAuth();

    const handleUpload = async (file: File) => {
        if (!user) return alert("You must be logged in!");

        const fakeSummary = "This is a sample AI-generated summary"; // Replace with AI call later
        const resource = await uploadResource(file);

        if (resource) {
            alert("File uploaded successfully!");
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                    if (e.target.files?.[0]) handleUpload(e.target.files[0]);
                }}
            />
        </div>
    );
};

export default Upload;
