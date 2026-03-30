export const TypingIndicator = () => (
  <div className="flex items-center space-x-1 p-2 text-gray-500 text-sm italic">
    <div className="flex space-x-1">
      <span className="animate-bounce">.</span>
      <span className="animate-bounce [animation-delay:0.2s]">.</span>
      <span className="animate-bounce [animation-delay:0.4s]">.</span>
    </div>
    <span>Собеседник печатает</span>
  </div>
);