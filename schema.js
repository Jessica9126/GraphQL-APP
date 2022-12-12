const axios = require('axios');
const { 
    GraphQLObjectType, 
    GraphQLInt, 
    GraphQLString, 
    GraphQLBoolean, 
    GraphQLList, 
    GraphQLSchema,
    GraphQLNonNull
} = require('graphql');

const users = [
    {id: 1, name: 'Jessica'},
    {id: 2, name: 'Jessica2'},
    {id: 3, name: 'Jessica3'},
    {id: 4, name: 'Jessica4'},
    {id: 5, name: 'Jessica5'},
    {id: 6, name: 'Jessica6'}
]

//User Type
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)}
    })
});

//Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        users: {
            type: new GraphQLList(UserType),
            resolve: () => users
        },
        // launches: {
        //     type: new GraphQLList(LaunchType),
        //     resolve(parent, args){
        //         return axios.get(`https://api.spacexdata.com/v3/launches`)
        //             .then(res => res.data); 
        //             //返回类型数组有问题
        //     }
        // },
    })
});

//Root Mutation
const RootMutation = new GraphQLObjectType({
    
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutation     
});