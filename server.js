const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const bcrypt = require('bcryptjs');
//const schema = require('./schema');
const cors = require('cors');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();

//Allow cross-origin
//app.use(cors());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

app.use(
    '/graphql',
    graphqlHTTP({
        schema: buildSchema(`

            type User{
                _id: ID!
                email: String!
                password: String!
            }

            type UserInfo{
                _id: ID!
                email: String!
                password: String!
                nickname: String!
                status: Boolean!
            }

            type Blog{
                _id: ID!
                owner: String!
                title: String!
                content: String!
                isliked: Boolean!
                picture: String!
                
            }

            input UserInput {
                email: String!
                password: String!
            }

            input UserInfoInput {
                email: String!
                password: String!
                nickname: String!
            }

            input BlogInput {
                email: String!
                owner: String!
                title: String!
                content: String!
            }

            type RootQuery{
                users: [User!]!
                user(email: String!, password: String!): User!
            }

            type RootMutation{
                createUser(userInput: UserInput): User
                createUserInfo(userinfoInput: UserInfoInput): UserInfo
                createBlog(blogInput: BlogInput): Blog
            }

            schema{
                query: RootQuery
                mutation: RootMutation    
            }

        `),
        rootValue: {
            users: () =>{
                return User.find().then(
                    users => {
                        return users.map(user =>{
                            // return {...user._doc};
                            return {...user._doc};
                        });   
                    }
                ).catch(err => {
                    throw err;
                });
            },
            user: async ({ email, password }) => {
                const user = await User.findOne({ email: email });
                if (!user) {
                  throw new Error('User does not exist!');
                }
                //const isEqual = await bcrypt.compare(password, user.password);
                if (password != user.password) {
                  throw new Error('Password is incorrect!');
                }
                return {...user._doc};
            },
            createUser: args => {
                // const user = {
                //     _id: Math.random().toString,
                //     username: args.userInput.username,
                //     password: args.userInput.password,
                // }
                // return user;
                const user = new User({
                    email: args.userInput.email,
                    password: args.userInput.password
                });
                return user.save().then(result =>{
                    console.log(result);
                    return {...result._doc};
                }).catch(err=>{
                    console.log(err);
                    throw err;
                });
            },
            createUserInfo: args => {
                const userinfo = new UserInfo({
                    email: args.userinfoInput.email,
                    password: args.userinfoInput.password,
                    nickname: args.userinfoInput.nickname,
                });
                return userinfo.save().then(result =>{
                    console.log(result);
                    return {...result._doc};
                }).catch(err=>{
                    console.log(err);
                    throw err;
                });
            },
            createBlog: args => {
                const blog = new Blog({
                    email: args.blogInput.email,
                    owner: args.blogInput.owner,
                    title: args.blogInput.title,
                    content: args.blogInput.content,
                });
                return blog.save().then(result =>{
                    console.log(result);
                    return {...result._doc};
                }).catch(err=>{
                    console.log(err);
                    throw err;
                });
            }
        },
        graphiql: true
    })
);

const PORT = process.env.PORT || 7000;

mongoose.connect(`mongodb+srv://root:root@atlascluster.hbnuqma.mongodb.net/
UserInfo?retryWrites=true&w=majority`)
        .then(()=>{
            app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
        })
        .catch(
            err => {
                console.log(err);
            }
        );



 