import { useEffect,useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Documentation(){  //renders project documentation inside the ui
    const[content, setContent]=useState("");
    useEffect(()=>{ //load README.md once when the component mounts
        fetch("/README.md")
        .then((res)=>res.text())
        .then(setContent)
    },[]);
    return(
        <div className="p-6 pt-15 max-w-4xl mx-auto prose prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
            </ReactMarkdown>
        </div>
    );
}