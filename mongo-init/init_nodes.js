
db = db.getSiblingDB('torlab');

const nodes = [];
for (let i = 1; i <= 9; i++) {
  nodes.push({
    nodeId: i,
    name: `relay${i}`,
    createdAt: new Date()
  });
}

db.nodes.deleteMany({});
db.nodes.insertMany(nodes);

print('Seeded nodes collection with 9 nodes.');
