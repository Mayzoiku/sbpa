import { Input } from "@/components/ui/input";
import { useFormik } from "formik";
import chat from "@/services/chat";
import { SendIcon } from "lucide-react";
import { useAtom } from "jotai";
import { chatAtom } from "@/atoms/chat";
import { MessageSquare } from "lucide-react";
import { useRef } from "react";
import { useEffect } from "react";

const Chat = () => {
  const [messages, setMessages] = useAtom(chatAtom);
  const messagesEndRef = useRef(null);
  const form = useFormik({
    initialValues: {
      message: "",
    },
    onSubmit: (values) => {
      form.resetForm();
      setMessages((prev) => [
        ...prev,
        { role: "user", content: values.message },
      ]);

      chat.getChatResponse({ message: values.message }).then((res) => {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: res.data.response },
        ]);
      });
    },
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative h-[80vh]">
      {/* Chat Box */}
      <div className="h-[70vh] flex flex-col max-w-4xl mx-auto">
        {messages?.length > 0 ? (
          <div className="flex-1 overflow-y-auto space-y-4">
            {messages.map((m) => (
              <div
                key={m.content}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-md shadow-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{m.content}</p>
                </div>
                <div ref={messagesEndRef} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center px-4">
            <MessageSquare className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-xl font-semibold mb-2">Start a conversation</p>
            <p className="text-md">
              Ask me anything about your finances, trends, or predictions!
            </p>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <form onSubmit={form.handleSubmit}>
          <div className="*:not-first:mt-2">
            <div className="relative">
              <Input
                id={form.id}
                className="pe-9 w-[40vw] h-12"
                placeholder="Type your message"
                {...form.getFieldProps("message")}
              />
              <button
                className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Subscribe"
              >
                <SendIcon size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
