const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");

// Veri setini yükleme
const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

// GraphQL şeması tanımı
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    events: [Event!]
  }

  type Event {
    id: ID!
    title: String!
    user: User!
    location: Location!
    participants: [Participant!]
  }

  type Location {
    id: ID!
    name: String!
    events: [Event!]
  }

  type Participant {
    id: ID!
    event: Event!
    user: User!
  }

  type Query {
    users: [User!]
    user(id: ID!): User
    events: [Event!]
    event(id: ID!): Event
    locations: [Location!]
    location(id: ID!): Location
    participants: [Participant!]
    participant(id: ID!): Participant
  }
`;

// Resolver fonksiyonları
const resolvers = {
  Query: {
    users: () => data.users,
    user: (parent, args) => data.users.find((user) => user.id === args.id),
    events: () => data.events,
    event: (parent, args) => data.events.find((event) => event.id === args.id),
    locations: () => data.locations,
    location: (parent, args) =>
      data.locations.find((location) => location.id === args.id),
    participants: () => data.participants,
    participant: (parent, args) =>
      data.participants.find((participant) => participant.id === args.id),
  },
  User: {
    events: (parent) =>
      data.events.filter((event) => event.userId === parent.id),
  },
  Event: {
    user: (parent) => data.users.find((user) => user.id === parent.userId),
    location: (parent) =>
      data.locations.find((location) => location.id === parent.locationId),
    participants: (parent) =>
      data.participants.filter(
        (participant) => participant.eventId === parent.id
      ),
  },
  Location: {
    events: (parent) =>
      data.events.filter((event) => event.locationId === parent.id),
  },
  Participant: {
    event: (parent) => data.events.find((event) => event.id === parent.eventId),
    user: (parent) => data.users.find((user) => user.id === parent.userId),
  },
};

// Apollo Server'ı başlatma
const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
