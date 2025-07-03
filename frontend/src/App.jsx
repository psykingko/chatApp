import { useState } from "react";
import OnboardingModal from "./components/OnboardingModal";
import ChatBox from "./components/ChatBox";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-black transition-colors duration-300">
      {!user ? <OnboardingModal setUser={setUser} /> : <ChatBox user={user} />}
    </div>
  );
}

export default App;
