"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "../../hooks/use-outside-click";

export default function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | boolean | null>(
    null
  );
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active && typeof active === "object") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <AnimatePresence>
        {active && typeof active === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && typeof active === "object" ? (
          <div className="fixed inset-0  grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.title}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIcon />
            </motion.button>
            <motion.div
              layoutId={`card-${active.title}-${id}`}
              ref={ref}
              className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div layoutId={`image-${active.title}-${id}`}>
                <img
                  width={200}
                  height={200}
                  src={active.src}
                  alt={active.title}
                  className="w-full h-80 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
                />
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.title}-${id}`}
                      className="font-bold text-neutral-700 dark:text-neutral-200"
                    >
                      {active.title}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.description}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400"
                    >
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.a
                    layoutId={`button-${active.title}-${id}`}
                    href={active.ctaLink}
                    target="_blank"
                    className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white"
                  >
                    {active.ctaText}
                  </motion.a>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]"
                  >
                    {typeof active.content === "function"
                      ? active.content()
                      : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full gap-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.title}-${id}`}
            key={`card-${card.title}-${id}`}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col md:flex-row ">
              <motion.div layoutId={`image-${card.title}-${id}`}>
                <img
                  width={100}
                  height={100}
                  src={card.src}
                  alt={card.title}
                  className="h-40 w-40 md:h-14 md:w-14 rounded-lg object-cover object-top"
                />
              </motion.div>
              <div className="">
                <motion.h3
                  layoutId={`title-${card.title}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left"
                >
                  {card.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${card.description}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left"
                >
                  {card.description}
                </motion.p>
              </div>
            </div>
            <motion.button
              layoutId={`button-${card.title}-${id}`}
              className="px-4 py-2 text-sm rounded-full font-bold bg-gray-100 hover:bg-green-500 hover:text-white text-black mt-4 md:mt-0"
            >
              {card.ctaText}
            </motion.button>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    description: "Birthday Message • 3:45",
    title: "Happy Birthday Mom",
    src: "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400",
    ctaText: "Play",
    ctaLink: "#",
    content: () => {
      return (
        <p>
          <strong>Happy Birthday Mom!</strong> <br /> <br />
          Your love and wisdom have shaped who I am today. Every lesson you taught me, every hug you gave me, and every sacrifice you made has led me to this moment. On your special day, I want you to know how deeply grateful I am to have you as my mother.
          <br /> <br />
          You've always been my biggest supporter, my voice of reason, and my source of unconditional love. The way you light up a room with your smile and make everyone feel welcome is truly magical. May this year bring you all the joy and happiness you've given to others.
          <br /> <br />
          <em>Created with love on your birthday ❤️</em>
        </p>
      );
    },
  },
  {
    description: "Encouragement • 2:30",
    title: "You've Got This, Sarah",
    src: "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=400",
    ctaText: "Play",
    ctaLink: "#",
    content: () => {
      return (
        <p>
          <strong>Hey Sarah,</strong> <br /> <br />
          I know things have been tough lately, but I want you to remember something important - you are absolutely incredible. Your strength and determination inspire me every single day. The way you handle challenges with grace and keep pushing forward is remarkable.
          <br /> <br />
          You've overcome so much already, and I have complete faith that you'll get through this too. Your resilience, your kind heart, and your brilliant mind are more powerful than any obstacle in your path. 
          <br /> <br />
          Remember: you are braver than you believe, stronger than you seem, and more loved than you know. I'm here for you, always.
          <br /> <br />
          <em>Sending you strength and love 💪</em>
        </p>
      );
    },
  },
  {
    description: "Gratitude • 4:15",
    title: "Thank You, Dad",
    src: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400",
    ctaText: "Play",
    ctaLink: "#",
    content: () => {
      return (
        <p>
          <strong>Dear Dad,</strong> <br /> <br />
          I've been thinking about all the ways you've shaped my life, and I realized I don't say "thank you" nearly enough. Your guidance, your patience, and your unwavering support have been the foundation of everything good in my life.
          <br /> <br />
          From teaching me to ride a bike to helping me navigate life's biggest decisions, you've always been there. Your wisdom, your work ethic, and your integrity have shown me what it means to be a good person. The values you instilled in me guide every choice I make.
          <br /> <br />
          Thank you for believing in me even when I didn't believe in myself. Thank you for your sacrifices, your love, and for being the amazing father you are.
          <br /> <br />
          <em>With endless gratitude and love 🙏</em>
        </p>
      );
    },
  },
  {
    description: "Friendship • 2:45",
    title: "To My Best Friend",
    src: "https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=400",
    ctaText: "Play",
    ctaLink: "#",
    content: () => {
      return (
        <p>
          <strong>Hey you amazing human!</strong> <br /> <br />
          I was just thinking about our friendship and couldn't help but smile. You bring so much joy, laughter, and light into my life. From our inside jokes to our deep 2 AM conversations, every moment with you is a treasure.
          <br /> <br />
          You have this incredible ability to make everyone around you feel special and loved. Your authenticity, your humor, and your generous heart make you one of the most wonderful people I know. I'm so grateful that life brought us together.
          <br /> <br />
          Thank you for being you - for your friendship, your support, and for all the memories we've created together. Here's to many more adventures ahead!
          <br /> <br />
          <em>Love you to the moon and back! 🌙✨</em>
        </p>
      );
    },
  },
  {
    description: "Encouragement • 3:20",
    title: "You're Stronger Than You Know",
    src: "https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400",
    ctaText: "Play",
    ctaLink: "#",
    content: () => {
      return (
        <p>
          <strong>A gentle reminder for tough times...</strong> <br /> <br />
          Life has a way of testing us, doesn't it? But here's what I want you to remember: you are so much stronger than you realize. Every challenge you've faced, every obstacle you've overcome, has built the incredible resilience that lives within you.
          <br /> <br />
          Your courage doesn't always roar. Sometimes it's the quiet voice at the end of the day saying "I will try again tomorrow." And that's exactly what makes you extraordinary - your ability to keep going, to keep believing, to keep hoping.
          <br /> <br />
          You are worthy of love, success, and all the beautiful things life has to offer. Trust in your journey, trust in your strength, and most importantly, trust in yourself.
          <br /> <br />
          <em>Believing in you always 💜</em>
        </p>
      );
    },
  },
  {
    description: "Celebration • 2:15",
    title: "Congratulations Graduate!",
    src: "https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=400",
    ctaText: "Play",
    ctaLink: "#",
    content: () => {
      return (
        <p>
          <strong>You did it! 🎓</strong> <br /> <br />
          What an incredible achievement! All those late nights studying, the stress of exams, the hard work and dedication - it has all led to this amazing moment. I am so incredibly proud of you and everything you've accomplished.
          <br /> <br />
          Your determination, intelligence, and perseverance have brought you to this milestone. But more than that, your kindness, your curiosity, and your passion for learning make you truly special. The world is lucky to have someone like you ready to make a difference.
          <br /> <br />
          As you step into this next chapter, remember that this is just the beginning. You have so much potential and so many wonderful things ahead of you. Congratulations on this well-deserved success!
          <br /> <br />
          <em>Celebrating you today and always! 🎉</em>
        </p>
      );
    },
  },
];