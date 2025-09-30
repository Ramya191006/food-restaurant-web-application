import aboutImage from "@/assets/about-restaurant.jpg";

const About = () => {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-in fade-in slide-in-from-left">
            <img
              src={aboutImage}
              alt="Surya Authentic Spices Restaurant"
              className="rounded-lg shadow-2xl w-full h-[500px] object-cover"
            />
          </div>
          <div className="animate-in fade-in slide-in-from-right">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">About Us</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                Welcome to <span className="font-bold text-primary">Surya Authentic Spices</span>, 
                where tradition meets taste. For over two decades, we have been serving 
                the finest authentic Indian cuisine, prepared with love and the most 
                carefully selected spices.
              </p>
              <p>
                Our journey began with a simple mission: to bring the authentic flavors 
                of traditional Indian cooking to food lovers. Every dish on our menu is 
                crafted using age-old recipes passed down through generations, combined 
                with the freshest ingredients.
              </p>
              <p>
                From our aromatic biryanis to our rich curries and soul-warming soups, 
                each dish tells a story of India's diverse culinary heritage. We take 
                pride in maintaining the authentic taste while ensuring the highest 
                standards of quality and hygiene.
              </p>
              <p className="font-semibold text-foreground">
                Experience the warmth of Indian hospitality and the magic of authentic 
                spices at Surya Authentic Spices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
