export default function BaseForm({ onSubmit, title, children,  }) {
  return (
    <form 
      onSubmit={onSubmit} 
      className="
        w-[85%] max-w-[400px] p-[20px_30px] rounded-[5px]
        bg-(--background-color)
        flex flex-col items-center
        animate-(--animate-fade-in-scale)
      "
    >
      <h2 
        className="
          text-md sm:text-lg md:text-xl lg:text-xl xl:text-xl 2xl:text-xl
          text-center
          mb-[20px]
        "
      >
        {title}
      </h2>

      {children}
    </form>
  );
}