import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Bold, Italic, Underline as UnderlineIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAdminStore } from "../Store/useAdminStore";

const extensions = [StarterKit.configure({ hardBreak: false }), Underline];

export default function TipTap() {
  const editor = useEditor({
  extensions,
  content: "",
  });
  const sendNotice = useAdminStore((state) => state.sendNotice);
  const [title, setTitle] = useState("");

  const onSendMessage = () => {
    const content = editor.getHTML();

    if (!title.trim() || !content.trim()) {
      return toast.error("Title and content cannot be empty!");
    }
    sendNotice({ title, content });
    setTitle("");
    editor.commands.clearContent();
  };

  if (!editor) return null;

  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <input type="text" value={title} onChange={(e)=> setTitle(e.target.value)}
      placeholder="Enter notice title"
      className="input input-bordered border-white w-full sm:w-3/4 lg:w-2/4 max-w-3xl"
      />

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl">
        <div className="flex-grow border border-base-content">
          <EditorContent editor={editor}
            className="w-full h-full min-h-[3rem] max-h-[400px] overflow-auto p-4 placeholder:text-white"
            placeholder="Type your notice here..." />
        </div>

        <div className="flex justify-center sm:justify-start w-full sm:w-auto mt-4 sm:mt-0">
          <button onClick={()=> editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`btn btn-outline ${
            editor.isActive("bold") ? "is-active btn-active btn-primary" : ""
            }`}
            >
            <Bold size={16} />
          </button>
          <button onClick={()=> editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`btn btn-outline ${
            editor.isActive("italic") ? "is-active btn-active btn-primary" : ""
            }`}
            >
            <Italic size={16} />
          </button>
          <button onClick={()=> editor.chain().focus().toggleUnderline().run()}
            disabled={!editor.can().chain().focus().toggleUnderline().run()}
            className={`btn btn-outline ${
            editor.isActive("underline") ? "is-active btn-active btn-primary" : ""
            }`}
            >
            <UnderlineIcon size={16} />
          </button>
          <button className="btn btn-primary" onClick={onSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}