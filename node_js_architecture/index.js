import {HabitsRouter} from './src/routes/habits.router.js';

const main = async () => {
  const router = new HabitsRouter();
  await router.route(process.argv.slice(2));
};

main();
