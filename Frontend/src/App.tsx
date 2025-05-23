import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faStop } from "@fortawesome/free-solid-svg-icons";

const send = <FontAwesomeIcon icon={faArrowUp} />;
const sent = <FontAwesomeIcon icon={faStop} />;

type Message = {
  user: string;
  response: string;
};

function App() {
  const [userInput, setUserInput] = useState<string>("");
  const [conversation, setConversation] = useState<Message[]>([]);
  const [loading, isLoading] = useState<boolean>(false);
  const [sents, isSent] = useState<boolean>(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    isLoading(true);
    isSent(true);
    setUserInput("");

    try {
      const res = await fetch(
        "https://terrific-youthfulness-production.up.railway.app/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_input: userInput }),
        }
      );

      const data: { response: string; user_input: string } = await res.json();
      setConversation((prev) => [
        ...prev,
        { user: data.user_input, response: data.response },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      isLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-[var(--base)] px-[5vw] md:px-[10vw] py-3 md:py-10 flex flex-col items-center">
      <h1
        className={`text-[var(--white)] text-3xl font-semibold pb-6 text-center ${
          sent ? "pt-6" : "pt-50"
        } md:pt-0`}
      >
        {!sents && "What can I help with?"}
      </h1>

      <div
        className={`text-white p-4 shadow max-h-200 overflow-y-scroll scroll-auto w-full flex flex-col gap-9
      rounded-[30px] custom-scroll mb-30 ${sents ? "md:mb-30" : "md:mb-0"}`}
      >
        <div>
          {conversation.map((msg, index) => (
            <div key={index} className="flex flex-col gap-5">
              <div className="w-full flex items-end justify-end">
                <div className="bg-[var(--container)] rounded-lg w-fit max-w-100 px-3 py-2">
                  {msg.user}
                </div>
              </div>
              <div dangerouslySetInnerHTML={{ __html: msg.response }} />
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div
          className={`flex items-start justify-start gap-2 text-white ${
            loading ? "block" : "hidden"
          }`}
        >
          <div
            className={`w-5 h-5 border-b-2 border-white rounded-full animate-spin  ${
              loading ? "block" : "hidden"
            }`}
          ></div>
          <div>
            <p>Thinking...</p>
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className={`border-1 border-white/25 rounded-[30px] px-5 py-4 h-fit  flex flex-col gap-3 items-end bg-[var(--container)] absolute w-[90%] md:w-[80%]  translate-y-0 bottom-5  ${
          sents ? "md:bottom-10 md:absolute" : "md:relative md:w-full"
        } `}
      >
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="text-sm md:text-lg text-white outline-0 w-full"
          placeholder="Ask something..."
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-10 h-10 bg-[var(--white)] text-[--base] hover:bg-gray-300 rounded-full flex items-center justify-center cursor-pointer"
        >
          {loading ? sent : send}
        </button>
      </form>
    </div>
  );
}

export default App;
