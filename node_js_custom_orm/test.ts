interface User {
  name: string;
  age: number;
  phoneNumber: string;
  [key: string]: string | number;
}

interface Product {
  [product: string]: string;
}

const food: Product = {
  milk: '10',
  bread: 'foo',
};

console.log(food);

const user: User = {
  name: 'John Doe',
  age: 32,
  phoneNumber: '0123456789',
};

const listGuest: Map<string | number, string> = new Map();

listGuest.set('name', 'John Doe');
listGuest.set(1, 'name');

for (const key in user) {
  console.log(user[key]);
}
