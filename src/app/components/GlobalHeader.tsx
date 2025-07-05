import Image from "next/image";

export default function GlobalHeader () {

    return (
        <div className="bg-gradient-bb text-white p-4 border-4 border-indigo-500k flex justify-end items-center gap-3">
            <span>My Username</span>
            <Image
            className="pr-3"
                src="/user-icon.svg"
                alt="Next.js logo"
                width={40}
                height={40}
                priority
            />
        </div>
    )
}