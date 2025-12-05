export type Database = {
    public: {
        Tables: {
            resources: {
                Row: {
                    id: string;
                    file_name: string;
                    file_url: string;
                    uploaded_by: string | null;
                    uploaded_at: string | null;
                    summary: string | null;
                };
                Insert: {
                    id?: string;
                    file_name: string;
                    file_url: string;
                    uploaded_by: string | null;
                    uploaded_at?: string | null;
                    summary?: string | null;
                };
                Update: {
                    id?: string;
                    file_name?: string;
                    file_url?: string;
                    uploaded_by?: string | null;
                    uploaded_at?: string | null;
                    summary?: string | null;
                };
            };

        };
    };
};