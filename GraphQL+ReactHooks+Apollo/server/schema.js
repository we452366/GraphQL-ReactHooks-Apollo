const graphql=require('graphql');
const {CategoryModel,ProductModel} =require('./model')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
}=graphql;

const categories=[
    {id:'1',name:'图书'},
    {id:'2',name:'数码'},
    {id:'3',name:'食品'},
]

const products=[
    {id:'1',name:'红楼梦',category:'1'},
    {id:'2',name:'西游记',category:'1'},
    {id:'3',name:'水浒传',category:'1'},
    {id:'4',name:'三国演义',category:'1'},
    {id:'2',name:'iPhone',category:'2'},
    {id:'3',name:'',category:'3'}
]

const Category =new GraphQLObjectType({
    name:'Category',
    fields:()=>(
        {
            id:{type:GraphQLString},
            name:{type:GraphQLString},
            products:{
                type:new GraphQLList(Product),
                resolve(parent){
                    return ProductModel.find({category:parent.id})
                }
            }
        }
    )
});

const Product=new GraphQLObjectType({
    name:'Product',
    fields:()=>(
        {
            id:{type:GraphQLString},
            name:{type:GraphQLString},
            category:{
                type:Category,
                resolve(parent){
                    return CategoryModel.findById(parent.category)
                }
            }
        }
    )
})

const RootQuery=new GraphQLObjectType({
    name:'RootQuery',
    fields:{
        getCategory:{
            type:Category,
            args:{
                id:{
                    type:GraphQLString
                }
            },
            resolve(parent,args){
                return CategoryModel.findById(args.id)
            }
        },
        getCategories:{
            type:new GraphQLList(Category),
            args:{

            },
            resolve(parent,args){
                return CategoryModel.find()
            }
        },
        getProduct:{
            type:Product,
            args:{
                id:{
                    type:GraphQLString
                }
            },
            resolve(parent,args){
                return ProductModel.findById(args.id);
            }
        },
        getProducts:{
            type:new GraphQLList(Product),
            args:{},
            resolve(parent,args){
                return ProductModel.find()
            }
        }
    }
});

const RootMutation=new GraphQLObjectType({
    name:'RootMutation',
    fields:{
        addCategory:{
            type:Category,
            args:{
                name:{
                    type:new GraphQLNonNull(GraphQLString)
                }
            },
            resolve(parent,args){
                // args.id=categories.length+1+'';
                // categories.push(args);
                // return args;
                return CategoryModel.create(args)
            }
        },
        addProduct:{
            type:Product,
            args:{
                name:{
                    type:new GraphQLNonNull(GraphQLString)
                },
                category:{
                    type:new GraphQLNonNull(GraphQLString)
                }
            },
            resolve(parent,args){
                // args.id=products.length+1+'';
                // products.push(args);
                // return args;
                return ProductModel.create(args)
            }
        }
    }
})

module.exports=new GraphQLSchema({
    query:RootQuery,
    mutation:RootMutation
})