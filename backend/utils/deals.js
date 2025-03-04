const dummyData = [
  { name: 'Milk', store: 'SuperMart', price: 10 },
  { name: 'Bread', store: 'Bakery Corner', price: 15 },
  { name: 'Eggs', store: 'FreshFarm', price: 20 },
  { name: 'Apples', store: 'Fruit Haven', price: 25 },
  { name: 'Chicken', store: 'Meat Master', price: 50 },
];

export async function getDeals() {
  if (process.env.NODE_ENV !== 'production') return dummyData;

  const response = await fetch(process.env.API_URL + '/api/deals');
  const deals = await response.json();
  return deals;
}
