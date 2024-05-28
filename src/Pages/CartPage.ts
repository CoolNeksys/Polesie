import { To } from 'copy-webpack-plugin';
import {Component} from '../Abstract/Component';
import { TGood, TGoodBasket, TServices, Total} from "../Abstract/Types";
import { CartBasket } from '../Common/CartBasket';

export class CartPage extends Component {
    divBasket!: Component;
    divBasketClear!: Component;
    divBasketGoods!: Component;
    order!: Component;
    
    constructor(parrent: HTMLElement, private services: TServices) {
        super(parrent, 'div', ["basket_pages"]);
        
        const container = new Component(this.root, 'div', ['container']);
        const mcont = new Component(container.root, 'div', ['cartpage']);
        
        services.dbService.getDataUser(services.authService.user).then(() => {
            services.dbService.calcTotal();
            
            let isBasketClear = false;
            if (services.dbService.dataUser) {
                if (services.dbService.dataUser.basket.length > 0) isBasketClear = true;
            }
            
            this.divBasketClear = new Component(mcont.root, 'div', ['basket__goods'], "");
            new Component(this.divBasketClear.root, 'h5', ['empty'], "Ваша корзина пуста");
            this.divBasket = new Component(mcont.root, 'div', ['basket__goods']);
            const Totals = new Component(mcont.root, 'div', ['totals']);
            this.toggleBasket(isBasketClear);
            
            const thead = new Component(this.divBasket.root, "div", ['tcart']);
            this.divBasketGoods = new Component(this.divBasket.root, 'div');
            
            if (services.dbService.dataUser) {
                services.dbService.dataUser.basket.forEach(el => {
                    this.putGoodsInBasket(this.divBasketGoods, el);
                });
            }
            
            const Wtitle = new Component(Totals.root, 'h1', null, 'Способ оплаты');
            const opt1 = new Component(Totals.root, 'div', ['opt']); 
            const card = new Component(opt1.root, "input", ['checking'], null, ["type", "data", "value"], ["checkbox", "dl", "courier"]).root as HTMLInputElement;
            card.checked = false;
            new Component(opt1.root, "p", ['dtext'], 'По карте');
            
            const opt2 = new Component(Totals.root, 'div', ['opt']); 
            const creds = new Component(opt2.root, "input", ['checking'], null, ["type", "data", "value"], ["checkbox", "dl", "self-pickup"]).root as HTMLInputElement;
            creds.checked = false;
            new Component(opt2.root, "p", ['dtext'], 'По реквизитам');
            const opt3 = new Component(Totals.root, 'div', ['opt']); 
            const cash = new Component(opt3.root, "input", ['checking'], null, ["type", "data", "value"], ["checkbox", "dl", "self"]).root as HTMLInputElement;
            cash.checked = false;
            new Component(opt3.root, "p", ['dtext'], 'Наличными');
            const credit = new Component(Totals.root, 'div', ['creds']);
            
            creds.addEventListener('change', () => {
                if (creds.checked) {
                    card.checked = false;
                    cash.checked = false;
                    credit.root.innerHTML = "Реквизиты для оплаты: <br> <br>  Номер Ерип: 2281337 <br>";
                } else {
                    credit.root.innerHTML = "";
                }
            });
            
            card.addEventListener('change', () => {
                if (card.checked) {
                    creds.checked = false;
                    cash.checked = false;
                    credit.root.innerHTML = "";
                }
            });

            cash.addEventListener('change', () => {
                if (cash.checked) {
                    creds.checked = false;
                    card.checked = false;
                    credit.root.innerHTML = "";
                }
            });

            const Ttitle = new Component(Totals.root, 'h1', null, 'Итог'); 
            const summ = new Component(Totals.root, 'p', ['t'], 'Сумма: <span>' + this.services.dbService.orderTotals.summ.toString() + ' руб </span>');
            const skidka = new Component(Totals.root, 'p', ['t'], 'Скидка: <span>' + this.services.dbService.orderTotals.percent.toString() + ' % </span>');
            const tot = new Component(Totals.root, 'h5', ['ttext'], 'Итого к оплате: <span>' + this.services.dbService.orderTotals.total.toString() + ' руб</span>');
            
            const updateTotal = () => {
                skidka.root.innerHTML = 'Скидка: <span>' + this.services.dbService.orderTotals.percent.toString() + ' % </span>';
                summ.root.innerHTML = 'Сумма: <span>' + this.services.dbService.orderTotals.summ.toString() + ' руб </span>';
                tot.root.innerHTML = 'Итого к оплате: <span>' + this.services.dbService.orderTotals.total.toString() + ' руб</span>';
            };
            
            this.order = new Component(Totals.root, "button", ['ordr'], 'Оформить заказ');
            this.order.root.onclick = () => {
                const dataUser = this.services.dbService.dataUser;
                
                if(card.checked || creds.checked){}
                else{
                    alert('Выберите способ оплаты');
                   return;
                }

                if (dataUser && dataUser.basket && dataUser.basket.length > 0) {
                    const user = this.services.authService.user;

                    const result = this.services.dbService.addBasketInHistory(user);
                    if (result instanceof Promise) {
                        result.then(() => {
                            alert('Заказ успешно оформлен');
                            window.location.reload();
                        }).catch((error) => {
                            console.error('Error adding basket to history:', error);
                            alert('Произошла ошибка при оформлении заказа');
                        });
                    } else {
                        alert('Заказ успешно оформлен');
                        window.location.reload();
                    }
                } else {
                    alert('Ваша корзина пуста!');
                }
            };
            

            services.dbService.addListener('delGoodFromBasket', () => {
                updateTotal();
                isBasketClear = false;
                if (services.dbService.dataUser) {
                    if (services.dbService.dataUser.basket.length > 0) isBasketClear = true;
                }
                this.toggleBasket(isBasketClear);
            });
            
            services.dbService.addListener('goodInBasket', (good) => {
                updateTotal();
                this.putGoodsInBasket(this.divBasketGoods, good as TGoodBasket);
                this.toggleBasket(true);
            });
            
            services.dbService.addListener('updateBasketCount', () => {
                updateTotal();
                isBasketClear = false;
                if (services.dbService.dataUser) {
                    if (services.dbService.dataUser.basket.length > 0) isBasketClear = true;
                }
                this.toggleBasket(isBasketClear);
            });
        });

        services.dbService.addListener('clearBasket', () => {
            this.divBasket.root.innerHTML = "";
            this.toggleBasket(false);
        });
    }

    putGoodsInBasket(tag: Component, product: TGoodBasket) {
        new CartBasket(tag.root, this.services, product);
    }

    toggleBasket(isBasketClear: boolean) {
        if (isBasketClear) {
            this.divBasketClear.remove();
            this.divBasket.render();
        } else {
            this.divBasket.remove();
            this.divBasketClear.render();
        }
    }
}
