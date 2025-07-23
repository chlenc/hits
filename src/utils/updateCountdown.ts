import dayjs from "dayjs";

export default function updateCountdown(
  depositUntil: string,
  setTimeLeft: (v: string) => void
) {
  const now = dayjs();
  const end = dayjs(depositUntil);
  const diff = end.diff(now);

  if (diff <= 0) {
    setTimeLeft("0d 0h 0m 0s");
    return;
  }

  const days = end.diff(now, "day");
  const hours = end.subtract(days, "day").diff(now, "hour");
  const minutes = end
    .subtract(days, "day")
    .subtract(hours, "hour")
    .diff(now, "minute");
  // const seconds = end
  //   .subtract(days, "day")
  //   .subtract(hours, "hour")
  //   .subtract(minutes, "minute")
  //   .diff(now, "second");

  let timeString = "";
  if (days > 0) timeString += `${days} days `;
  if (hours > 0) timeString += `${hours} hours `;
  if (minutes > 0) timeString += `${minutes} mins `;
  // timeString += `${seconds}s`;
  setTimeLeft(timeString.trim());
}
