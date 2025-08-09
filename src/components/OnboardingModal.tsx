import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import onboarding1 from "../assets/onboarding/1.webp";
import onboarding2 from "../assets/onboarding/2.webp";
import onboarding3 from "../assets/onboarding/3.webp";
import onboarding4 from "../assets/onboarding/4.webp";
import onboarding5 from "../assets/onboarding/5.webp";
// import onboarding6 from "../assets/onboarding/6.webp";
import onboarding7 from "../assets/onboarding/7.webp";
import { observer } from "mobx-react-lite";
import { useStores } from "../stores/useStores";

interface OnboardingStep {
  image: string;
  title: string;
  subtitle: string;
  btnText: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    image: onboarding1,
    title: "Paper trading is live",
    subtitle:
      "You can explore the full trading experience with just ETH without a risk. Let's start!",
    btnText: "Next",
  },
  {
    image: onboarding2,
    title: "Step 1: Connect Wallet",
    subtitle:
      "Connect your wallet and go to Strategies page to get a few tickets",
    btnText: "Next",
  },
  {
    image: onboarding3,
    title: "Step 2: Choose Strategy",
    subtitle:
      "This is what an active strategy looks like — it has a chart and a range.",
    btnText: "Next",
  },
  {
    image: onboarding4,
    title: "Step 3: Enter next strategy",
    subtitle:
      "You can use your tickets to join the next strategy. Every ticket is book like.",
    btnText: "Next",
  },
  {
    image: onboarding5,
    title: "Step 4: Wait for Session start",
    subtitle:
      "At the start of the trading session, we'll find out the range for the strategy.",
    btnText: "Next",
  },
  //   {
  //     image: onboarding6,
  //     title: "Step 5: Repeat every day",
  //     subtitle:
  //       "You'll get one ticket per day. At the end of the day, a leaderboard will be formed, and we'll update it daily in Telegram.",
  //     btnText: "Our Telegram",
  //   },
  {
    image: onboarding7,
    title: "Step 6: Have Fun!",
    subtitle:
      "And don't forget about our Referral program! Invite your friends to join and earn rewards!",
    btnText: "Start Trading",
  },
];

const OnboardingModal = observer(() => {
  const { accountStore } = useStores();
  const [open, setOpen] = useState(!accountStore.onboardingCompleted);
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      accountStore.setOnboardingCompleted(true);
      setOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCurrentStep(0); // Reset step when closing
    }
    setOpen(open);
  };

  if (accountStore.onboardingCompleted) {
    return null;
  }

  const currentStepData = onboardingSteps[currentStep];

  return (
    <Modal
      open={open}
      onOpenChange={handleOpenChange}
      image={currentStepData.image}
      title={currentStepData.title}
      subtitle={currentStepData.subtitle}
      btnText={currentStepData.btnText}
      onClick={handleNext}
    />
  );
});

export default OnboardingModal;
