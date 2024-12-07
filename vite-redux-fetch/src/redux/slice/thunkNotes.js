
//Thunk function
/*
A thunk is a function that gets dispatched like a regular action but allows you to perform side effects,
 such as making an API call, before dispatching a result action to update the Redux store.

When you dispatch a createAsyncThunk function (e.g., fetchTasksAsync()), it doesn't directly go to the reducer. 
Instead, createAsyncThunk acts as a middleware, runs the async logic, and then dispatches actions like pending, fulfilled, or rejected.

createAsyncThunk helps you avoid writing middleware or managing multiple actions manually.
It simplifies the process of handling async code in Redux.



 Redux Toolkit automatically generates three action types from this:
"tasks/fetchTasksAsync/pending"
"tasks/fetchTasksAsync/fulfilled"
"tasks/fetchTasksAsync/rejected"

syntax:

 createAsyncThun(sliceName/thunkFunctionName,async (payload)=> {
      fetch logic
  })

  here the second arg, payloadCreator is an async function, it receives payload we pass to dispatch(thunkFuncName(payload)) in component


console.log(fetchTasksAsync)
this gives the thunk function definition

This is because fetchTasksAsync is a function created by createAsyncThunk.
here createAsyncThunk acts as a function factory


console.log(fetchTasksAsync())
this gives us the return value of thunk function
which is usually a promise

The promise resolves when the async operation inside the thunk finishes (success or failure).

once that promise is fulfilled then that value is used in

.addCase(fetchTasksAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taskList = action.payload;
        })

HERE:

addCase is a method attached to the builder object, 
it is available in the extraReducers function of a createSlice or createReducer 

this method takes action type or action creator and reducer function as args
and updates the state based on that 

here,

fetchTasksAsync.fulfilled this is shorthand for 
"tasks/fetchTasksAsync/fulfilled"
both will work. but its better to handle it through shorthand



FLOW:

A user clicks on some button

then the relevant component receives an action object inside the dispatch()
method given by useDispatch() hook by react-redux

this action object contains a type string and optionally a payload

then dispatch() method dispatches or sends that action object to store
store is the central part of our redux mechanism and our whole state is controlled from there

so after store receiving the dispatched action.


        '''
        #Continue from top but continue here only for sync actions

        if the action is sync then:

        It sends it to all the reducers present in it (it creates a root reducer and contains all reducers in it)

        then whichever reducer has a matching type with the action.type from action object
        that reducer receives the whole action object along with current state as args

        then the reducer function/method updates the state accordingly 
        (It basically returns the new state, but we see as if its mutating the current state,
        is does so by the help of immer.js library bts)

        after updation of the state, the new state is recognised buy the store
        and it replaces the old state by the new one and all the components 
        which have subscribed to the store by the help of useSelector() hook, they get 
        the update of the state and they rerender

        after that the screen is updated with the relavent output

        '''

If it's an async action then : 

Before sending that action object to reducer the redux functionality called middleware
stops/intercepts it, and performs the asyc part of code like fetching or doing CRUD operations

Here a new concept of redux toolkit comes into the picture createAsycThunk(),
createAsyncThunk() is a powerful function provided by redux toolkit to avoid
usage and creation of manual middlewares. createAsyncThunk() is nothing but a function factory
because it returns an async function which eventually returns a promise

so createAsyncThunk() takes an action type string and an async payload creator function as args
and returns a promise.
this second arg of async payloadCreator function is important because here only all the important
fetching/crud part logic takes place, it is an async function so it returns a Promise.

so when this promise runs it begins with pending then it is settled in either cases
like fulfilled or rejected

so based on that, suppose the promise is settled into fulfilled. Then the code now moves
towards the reducers because the async part is now over and reducers are pure functions
so no async logic happens there. 

Now we are in extraReducers function which is provided by redux toolkit to handle the 
async fetching (Because It can Handle actions from external sources or thunks or any actions.
Whereas reducers handles action produced by the slice itself, Here we are taking action types from createAsyncThunk)

So in extraReducers, we have 3 addCase methods explicitly to handle every possible
outcome of each async call.

So as we took the example of fulfilled state, Lets continue that only
so extraReducers take an builder object as argument and then we can chain addCase() methods
to it

addCase() methods basically takes the action type string ,
these action types can be manually provided but its best to use the shorthand method because typos can happen.
like suppose for the fulfilled promise

syntax : [sliceName]/[asyncThunkName]/[lifecycle]
action type string would be "sliceName/asyncThunkFunctionName/fulfilled"
but the shorthand method is asyncThunkFunctionName.fulfilled

along with action type strings it also takes reducer function as arg (which takes current state,action as arg)
and upates/returns new state by the help of immer.js 

then rest is same as sync part above :
  after updation of the state, the new state is recognised buy the store
  and it replaces the old state by the new one and all the components 
  which have subscribed to the store by the help of useSelector() hook, they get 
  the update of the state and they rerender

  after that the screen is updated with the relavent output




'''
REWRITTEN ABOVE
(like createAsyncThunk), middleware intercepts it
Middleware handles the async logic and dispatches pending, fulfilled, or rejected actions as needed.

The store forwards the action to the relevant extra reducer (async).
Based on the action type (e.g., pending, fulfilled, rejected), the reducer updates the state.

As the reducer updates the state. The new state is recognised by store

Components which are subscribed to store using useSelector automatically re-render
(because state changed)

'''

BRAVO

*/
