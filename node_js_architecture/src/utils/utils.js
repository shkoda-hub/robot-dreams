export const showAsTable = (data) => {
  console.table(data);
};

export const parseConsoleInput = (input) => {
  const parsed = {
    operation: input[0],
  };

  for (let i = 1; i < input.length; i++) {
    const token = input[i];

    if (token.startsWith('--')) {
      const key = token.slice(2);
      parsed[key] = input[i + 1];
      i++;
    }
  }

  return parsed;
};
