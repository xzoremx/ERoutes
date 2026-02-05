export function BackgroundLayer() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Sky Background Image */}
            <img
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/bfd2f4cf-65ed-4b1a-86d1-a1710619267b_1600w.png"
                alt="Sky Background"
                className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply"
            />

            {/* Gradient Overlay to create the fade-to-warm-beige effect at bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#A6CBE8]/20 via-[#BFD9EF]/40 to-[#EAE3D6]"></div>

            {/* Cloud Decoration Left */}
            <img
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/4734259a-bad7-422f-981e-ce01e79184f2_1600w.jpg"
                className="absolute top-[20%] -left-[10%] w-[50%] opacity-40 mix-blend-screen blur-xl pointer-events-none"
                alt="cloud"
            />

            {/* Cloud Decoration Right */}
            <img
                src="https://hoirqrkdgbmvpwutwuwj.supabase.co/storage/v1/object/public/assets/assets/917d6f93-fb36-439a-8c48-884b67b35381_1600w.jpg"
                className="absolute top-[30%] -right-[10%] w-[50%] opacity-40 mix-blend-screen blur-xl pointer-events-none"
                alt="cloud"
            />
        </div>
    );
}
