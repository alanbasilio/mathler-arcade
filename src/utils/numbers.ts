const defaultMessage = " Using number of the day instead.";

export function getNumberOfTheDay() {
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();
  const dateParam = searchParams.get("date");

  let now = new Date();

  if (dateParam) {
    const day = parseInt(dateParam.slice(0, 2), 10);
    const month = parseInt(dateParam.slice(2, 4), 10) - 1; // Months are 0-indexed
    const year = parseInt(dateParam.slice(4), 10);

    if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
      const paramDate = new Date(year, month, day);
      if (
        isValidDate(paramDate) &&
        paramDate.getDate() === day &&
        paramDate.getMonth() === month &&
        paramDate.getFullYear() === year
      ) {
        now = paramDate;
      } else {
        console.log(`Invalid date in URL. ${defaultMessage}`);
      }
    } else {
      console.log(`Malformed date in URL. ${defaultMessage}`);
    }
  }

  function isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  const start = new Date(2022, 0, 0);
  const diff = Number(now) - Number(start);
  let day = Math.floor(diff / (1000 * 60 * 60 * 24));
  while (day > answers.length) {
    day -= answers.length;
  }
  return answers[day];
}

export const answers = [
  "55+5*2", // 65
  "99-9/3", // 96
  "12*4+3", // 51
  "72/8+1", // 10
  "7*7+14", // 63
  "90-6*5", // 60
  "2+4*22", // 90
  "81/9+6", // 15
  "15+3*8", // 39
  "64/8*3", // 24
  "11+4*7", // 39
  "95-7*5", // 60
  "3*9+36", // 63
  "48/6+7", // 15
  "13+2*9", // 31
  "80-7*3", // 59
  "5*5+24", // 49
  "72/9+1", // 9
  "18+3*7", // 39
  "60/5*4", // 48
  "9+5*11", // 64
  "88-4*7", // 60
  "4*7+30", // 58
  "54/6+5", // 14
  "16+2*8", // 32
  "75-5*3", // 60
  "6*6+21", // 57
  "63/9+4", // 11
  "22+3*6", // 40
  "56/7*6", // 48
  "8+4*13", // 60
  "92-6*5", // 62
  "3*8+42", // 66
  "45/5+8", // 17
  "19+2*7", // 33
  "70-4*5", // 50
  "5*7+20", // 55
  "81/9+2", // 11
  "25+3*5", // 40
  "48/6*7", // 56
  "7+6*11", // 73
  "96-8*3", // 72
  "4*9+27", // 63
  "36/4+6", // 15
  "14+3*9", // 41
  "85-5*7", // 50
  "6*5+33", // 63
  "72/8+3", // 12
  "28+2*6", // 40
  "54/6*8", // 72
  "9+7*10", // 79
  "98-7*4", // 70
  "3*11+4", // 37
  "63/7+5", // 14
  "17+2*9", // 35
  "75-3*8", // 51
  "5*8+19", // 59
  "90/9+1", // 11
  "31+3*4", // 43
  "42/6*9", // 63
  "6+5*13", // 71
  "94-6*6", // 58
  "4*8+35", // 67
  "27/3+7", // 16
  "20+3*7", // 41
  "80-4*7", // 52
  "7*7+12", // 61
  "54/6+4", // 13
  "34+2*5", // 44
  "48/8*9", // 54
  "8+6*12", // 80
  "97-7*5", // 62
  "3*10+7", // 37
  "72/8+2", // 11
  "23+3*6", // 41
  "65-5*3", // 50
  "6*6+25", // 61
  "81/9+3", // 12
  "37+2*4", // 45
  "36/4*9", // 81
  "5+7*11", // 82
  "93-6*7", // 51
  "4*9+31", // 67
  "45/5+6", // 15
  "26+3*5", // 41
  "70-3*7", // 49
  "8*5+17", // 57
  "63/7+4", // 13
  "40+2*3", // 46
  "30/5*9", // 54
  "7+6*13", // 85
  "95-8*4", // 63
  "3*9+39", // 66
  "54/6+5", // 14
  "29+2*7", // 43
  "60-4*3", // 48
  "5*7+22", // 57
  "72/8+3", // 12
];
