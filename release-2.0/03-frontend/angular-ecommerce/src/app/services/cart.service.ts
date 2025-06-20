import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = []

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = sessionStorage;
  // storage: Storage = localStorage;

  constructor() { 

    // read data from storage
    // parse change the string to object
    let data = JSON.parse(this.storage.getItem('cartItems')!);
    // console.log("Data in storage: " + data);

    if (data != null) {
      this.cartItems = data;

      // compute totals based on the data that is read from storage
      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem) {

    // check if we already have the item in the cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if(this.cartItems.length > 0) {
       // find the item in the car bsed on item id

      //  for (let tempCartItem of this.cartItems) {
      //   if (tempCartItem.id == theCartItem.id) {
      //     existingCartItem = tempCartItem;
      //     break;
      //   }
      //  }

      // return first elemen that passes, else returns undefined
      // executes test for each element in the array until test passes
      existingCartItem = this.cartItems.find( tempCartItem => tempCartItem.id === theCartItem.id )!;

      // check if found it
      alreadyExistsInCart = (existingCartItem != undefined);
    }

    if(alreadyExistsInCart) {
    // increment the quantity
    existingCartItem.quantity++;
  }
  else{
    // just add the item to the array
    this.cartItems.push(theCartItem);
  }

  // compute total price and total quantity
  this.computeCartTotals();
  }

  computeCartTotals() {
    
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values.. all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data for debugging
    this.logCartData(totalPriceValue, totalQuantityValue);

    // persist cart data
    this.persistCartItems();
  }

  persistCartItems() {
    // stringify change the object to string
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    
    // console.log('Contents of the cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      // console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}`);
    }

    // console.log(`total Price: ${totalPriceValue.toFixed(2)}, totalQuantity=${totalQuantityValue}`);
    // console.log('--------------------------------------------------------');
  }

  decrementQuantity(theCartItem: CartItem) {

    theCartItem.quantity--;

    if(theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    else{
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {

    // get the index of item in the array
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id);

    // if found, remove the item from the array at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }

}
