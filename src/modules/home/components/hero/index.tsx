import { Button, Heading } from "@medusajs/ui"

const Hero = () => {
  return (
    <div className="h-[75vh] w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="absolute inset-0 bg-gray-100">
        <div className="absolute inset-0">
          <div className="w-full h-full flex items-center justify-center">
            <img
              src="https://usvyrqueydlhopscrkju.supabase.co/storage/v1/object/public/husfox/husfoxhero.jpg"
              alt="Husfox Hero"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Black overlay for better text visibility */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
      </div>
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center small:p-32 gap-6">
        <span>
          <Heading
            level="h1"
            className="text-3xl leading-10 text-ui-fg-base font-normal text-white"
          >
            Welcome to Husfox
          </Heading>
          <Heading
            level="h2"
            className="text-2xl leading-10 text-ui-fg-subtle font-normal text-gray-400"
          >
            Timeless Wear, Modern Edge.
          </Heading>
        </span>
        <a href="/store">
          <Button variant="secondary">Shop Now</Button>
        </a>
      </div>
    </div>
  )
}

export default Hero
