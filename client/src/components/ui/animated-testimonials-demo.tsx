import { AnimatedTestimonials } from "./animated-testimonials";

export default function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote:
        "Happy Birthday Mom! Your love and wisdom have shaped who I am today. Every lesson you taught me, every hug you gave me, and every sacrifice you made has led me to this moment. On your special day, I want you to know how deeply grateful I am to have you as my mother. You've always been my biggest supporter, my voice of reason, and my source of unconditional love.",
      name: "Happy Birthday Mom",
      designation: "Birthday Message • 3:45",
      src: "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      quote:
        "Hey Sarah, I know things have been tough lately, but I want you to remember something important - you are absolutely incredible. Your strength and determination inspire me every single day. The way you handle challenges with grace and keep pushing forward is remarkable. You've overcome so much already, and I have complete faith that you'll get through this too.",
      name: "You've Got This, Sarah",
      designation: "Encouragement • 2:30",
      src: "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      quote:
        "Dear Dad, I've been thinking about all the ways you've shaped my life, and I realized I don't say thank you nearly enough. Your guidance, your patience, and your unwavering support have been the foundation of everything good in my life. From teaching me to ride a bike to helping me navigate life's biggest decisions, you've always been there.",
      name: "Thank You, Dad",
      designation: "Gratitude • 4:15",
      src: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      quote:
        "Hey you amazing human! I was just thinking about our friendship and couldn't help but smile. You bring so much joy, laughter, and light into my life. From our inside jokes to our deep 2 AM conversations, every moment with you is a treasure. You have this incredible ability to make everyone around you feel special and loved.",
      name: "To My Best Friend",
      designation: "Friendship • 2:45",
      src: "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      quote:
        "You did it! What an incredible achievement! All those late nights studying, the stress of exams, the hard work and dedication - it has all led to this amazing moment. I am so incredibly proud of you and everything you've accomplished. Your determination, intelligence, and perseverance have brought you to this milestone.",
      name: "Congratulations Graduate!",
      designation: "Celebration • 2:15",
      src: "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];
  
  return <AnimatedTestimonials testimonials={testimonials} autoplay={true} />;
}