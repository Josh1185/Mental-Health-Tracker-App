export default function FormInput({ label, type = "text", register, name, rules = {}, error, ...rest }) {
  return (
    <>
      <div
        className="
          relative
          w-full h-[40px] mt-[20px]
          border-b-[2px] border-b-solid border-b-(--input-border-color)
          text-sm sm:text-sm md:text-base lg:text-base xl:text-base 2xl:text-base
        "
      >
        <input
          type={type}
          {...register(name, rules)}
          {...rest}
          className="
            w-full h-full
            pl-[5px]
            bg-transparent border-none outline-none
            peer
          "
        />
        <label
          className="
            absolute top-1/2 left-[5px]
            transform -translate-y-[50%]
            text-(--text-color)
            pointer-events-none
            transition-all duration-500
            peer-focus:top-[-5px] peer-focus:font-[400]
            peer-valid:top-[-5px] peer-valid:font-[400]
          "
        >
          {label}
        </label>
      </div>
      { error && <p 
        className="
          text-red-500
          text-sm sm:text-sm md:text-base lg:text-base xl:text-base 2xl:text-base
          text-left
          w-full pl-[5px]
        "
      >
        {error.message}
      </p>}
    </>
  );
}