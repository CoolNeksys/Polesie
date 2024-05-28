import { th } from 'date-fns/locale';
import {Component} from '../Abstract/Component';
import { TServices } from '../Abstract/Types';
import { TGood } from '../Abstract/Types'
import { DBService } from '../Services/DBService';

export class Cart extends Component{

    btnBasket: Component;

    constructor(parrent: HTMLElement, private services: TServices, private data: TGood) {
        super(parrent, "div", ["mainitem"]);
        new Component(
            this.root,
            "img",
            [],
            null,
            ["src", "alt"],
            [data.url, data.name]
        );

        let title = new Component (this.root, "h2", [], data.name);

        new Component (this.root, "h3", [], data.price.toString() +' РУБ');

        this.btnBasket = new Component(
            this.root,
            "input",
            ["btn"],
            null,
            ["value", "type"],
            ["В корзину", "button"]
        );

        if (services.dbService.dataUser) {
            const index = services.dbService.dataUser.basket.findIndex(el => el.good.id === data.id);
            if (index >= 0) {
                (this.btnBasket.root as HTMLInputElement).value = "Уже в корзине";
                this.btnBasket.root.classList.add('disabled');
            };
        }
        
        this.btnBasket.root.onclick = () => {
            (this.btnBasket.root as HTMLInputElement).disabled = true;
          this.addGoodInBasket();
        };

        services.dbService.addListener('delGoodFromBasket', (idGood) => {
        if (idGood === data.id) {
            (this.btnBasket.root as HTMLInputElement).value = "В корзину";
            this.btnBasket.root.classList.remove('disabled');
        }
        })
    }

    addGoodInBasket() {
        const user = this.services.authService.user;
        (this.btnBasket.root as HTMLInputElement).value =  "Уже в корзине";
        this.btnBasket.root.classList.add('disabled');
        this.services.dbService.addGoodInBasket(user, this.data)
        .catch (() => {
            (this.btnBasket.root as HTMLInputElement).value =  "В корзину";
            this.btnBasket.root.classList.remove('disabled');
            console.log('pizdec');
        });
     }
}