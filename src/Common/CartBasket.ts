import { Component } from "../Abstract/Component";
import { TGood, TGoodBasket, TServices} from "../Abstract/Types";

export class CartBasket extends Component{

    constructor(
        parrent: HTMLElement,
        private services: TServices,
        private data: TGoodBasket
    ) {
        super(parrent, "div", ["cart_basket"]);

        new Component(
            this.root,"img",["cart_basket__image"],null,["src","alt"],[data.good.url, data.good.name]
        );

        new Component(this.root, 'h3', null, data.good.name);
        new Component (this.root, "h3", [], data.good.price.toString() +' руб');
        

        const divCount = new Component(this.root, "div", ["cart_basket__count"]);
        const btnDec = new Component (
            divCount.root,
            "input",
            ["count__button"],
            null,
            ["value", "type"],
            ["-", "button"]
        );

        const divNumber = new Component(divCount.root, "div", ["div__count"]);
        const spanCount = new Component(
            divNumber.root,
            "span", ["count__number"], data.count.toString()
        );

        const btnInk = new Component(
            divCount.root,
            "input", ["count__button"], null, ["value", "type"], ["+", "button"]
        );

        const totalitm = new Component(this.root, 'p', null,((data.good.price * data.count)).toString() + ' руб');

        const delbtn = new Component(this.root, 'a', ['delbtn'], '✖');

        delbtn.root.onclick = () =>{
            this.delGoodFromBasket();
        }

        btnDec.root.onclick = () => {
            if (this.data.count > 1) {
                this.data.count--;
                this.updateCount();
            } else 
                this.delGoodFromBasket();
        };
        

        btnInk.root.onclick = () => {
            if (this.data.count < 10) {
                this.data.count++;
                this.updateCount();
            }
        };

        this.services.dbService.addListener('updateBasketCount', ()=>{
            totalitm.root.innerHTML = ((data.good.price * data.count) - (data.good.price * data.count*services.dbService.orderTotals.percent/100)).toString() + ' руб';
        })

        this.services.dbService.addListener('delGoodFromBasket', ()=>{
            totalitm.root.innerHTML = ((data.good.price * data.count) - (data.good.price * data.count*services.dbService.orderTotals.percent/100)).toString() + ' руб';
        })

    }

    updateCount() {
        const spanCount = this.root.querySelector(".count__number") as HTMLSpanElement;
        spanCount.textContent = ' ' + this.data.count.toString() + ' ';
        const user = this.services.authService.user;
        this.services.dbService.updateBasketCount(user, this.data).then(() => {
        }).catch(() => {
        });
    }

    delGoodFromBasket() {
        const user = this.services.authService.user;
        this.services.dbService.delGoodFromBasket(user, this.data)
        .then(() => {
            this.remove();
        })
     }
}