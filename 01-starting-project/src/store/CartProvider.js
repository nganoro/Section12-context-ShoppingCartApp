import { useReducer } from 'react';

import CartContext from './cart-context';

const defaultCartState = {
    items: [],
    totalAmount: 0
};

const cartReducer = (state, action) => {
    if (action.type === 'ADD'){
        //concat is same as push, but doesn't edit the existing array, returns new one
        const updatedTotalAmount = state.totalAmount + action.item.price * action.item.amount;
        const existingCartItemIndex = state.items.findIndex(
            item => item.id === action.item.id
        );
        const existingCartItem = state.items[existingCartItemIndex];
        let updatedItems;

        //all this does, is update the amount of an object as supposed to having it repeated seperately
        if(existingCartItem) {
            const updatedItem = {
                ...existingCartItem,
                amount: existingCartItem + action.item.amount
            }
            //gets the old array so that in the following line, he can override it with the new value
            updatedItems = [...state.items];
            updatedItems[existingCartItemIndex] = updatedItem;
        } else {
        //this is for when it's being added for the first time, and not being updated
            updatedItems = state.items.concat(action.item);
        }

        return {
            items: updatedItems,
            totalAmount: updatedTotalAmount
        };
    }
    if (action.type === 'REMOVE'){
        const existingCartItemIndex = state.items.findIndex(
            (item) => item.id === action.id 
        );
        const existingItem = state.items[existingCartItemIndex];
        const updatedTotalAmount = state.totalAmount - existingItem.price;
        let updatedCartItems;
        if(existingItem.amount === 1){
        // will filter thru the array and apply the logic n keeps whats true(removes action.id that's equal to item.id)
            updatedCartItems = state.items.filter(item => item.id != action.id);
        } else {
            const updatedItem = { ...existingItem, amount: existingItem.amount - 1 };
            updatedCartItems = [...state.items];
            updatedCartItems[existingCartItemIndex] = updatedItem;
        }

        return {
            items: updatedCartItems,
            totalAmount: updatedTotalAmount
        }
    }

    return defaultCartState;
};

const CartProvider = (props) => {
    const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultCartState);

    const addItemToCartHandler = (item) => {
        dispatchCartAction({type: 'ADD', item: item});
    };

    const removeItemToCartHandler = (id) => {
        dispatchCartAction({type: 'REMOVE', id: id});
    };

    const cartContext = {
        items: cartState.items,
        totalAmount: cartState.totalAmount,
        addItem: addItemToCartHandler,
        removeItem: removeItemToCartHandler
    };

    return (
        <CartContext.Provider value={cartContext}>
            {props.children}
        </CartContext.Provider>
    )
};

export default CartProvider;