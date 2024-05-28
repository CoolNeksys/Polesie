import { ca } from 'date-fns/locale';
import { Component } from '../Abstract/Component';
import { TServices } from '../Abstract/Types';
import { TGood } from '../Abstract/Types';
import { Cart } from '../Common/Cart';

export class GoodsPage extends Component {
    private filteredGoods: TGood[] = [];
    
    constructor(parrent: HTMLElement, private services: TServices) {
        super(parrent, 'div', ['goods_pages']);
        const container = new Component(this.root, 'div', ['container']);
        const divSort = new Component(container.root, 'div', ['divsort']);

        // Create label for category dropdown
        new Component(divSort.root, 'label', null, 'Категория:', ['for'], ['categorySelect']);

        // Create dropdown for categories
        const categorySelect = new Component(divSort.root, 'select', ['categorySelect']);
        new Component(categorySelect.root, 'option', null, 'Все', ['value'], ['all']);
        new Component(categorySelect.root, 'option', null, 'Конструктор', ['value'], ['construct']);
        new Component(categorySelect.root, 'option', null, 'Самокаты', ['value'], ['samokat']);
        new Component(categorySelect.root, 'option', null, 'Развивающие игрушки', ['value'], ['develop']);
        new Component(categorySelect.root, 'option', null, 'Велосипеды', ['value'], ['bike']);
        new Component(categorySelect.root, 'option', null, 'Машинки', ['value'], ['cars']);
        new Component(categorySelect.root, 'option', null, 'Ледянки', ['value'], ['skates']);

        // Create label for sorting dropdown
        new Component(divSort.root, 'label', null, 'Сортировать по цене:', ['for'], ['sortSelect']);

        // Create dropdown for sorting
        const sortSelect = new Component(divSort.root, 'select', ['sortSelect']);
        new Component(sortSelect.root, 'option', null, 'Возрастание', ['value'], ['up']);
        new Component(sortSelect.root, 'option', null, 'Убывание', ['value'], ['down']);

        const carts = new Component(container.root, 'div', ['carts']);
        const divCrit = new Component(container.root, "div", ["goods__crit"]);

        divSort.root.addEventListener('change', async (event) => {
            if (event.target instanceof HTMLSelectElement) {
                if (event.target.classList.contains('categorySelect')) {
                    const selectedCat = event.target.value;
                    if (selectedCat) {
                        if (selectedCat === 'all'){
                            this.clearGoodsFromPage(carts);
                            this.putGoodOnPage(carts, goods);
                        } 
                        else {
                            this.filteredGoods = goods.filter((product) => product.cat === selectedCat);
                            this.clearGoodsFromPage(carts);
                            this.putGoodOnPage(carts, this.filteredGoods);
                        }
                    }
                } else if (event.target.classList.contains('sortSelect')) {
                    const sortType = event.target.value;
                    const sortedGoods = this.sortGoods(this.filteredGoods, sortType);
                    this.clearGoodsFromPage(carts);
                    this.putGoodOnPage(carts, sortedGoods);
                }
            }
        });

        let goods: TGood[] = [];

        services.dbService.getAllGoods().then((data) => {
            goods = data;
            this.filteredGoods = goods;
            console.log(goods);
            this.putGoodOnPage(carts, goods);
        });
    }

    sortGoods(goods: TGood[], sortType: string | null): TGood[] {
        if (sortType === 'up') {
            return goods.slice().sort((a, b) => a.price - b.price);
        } else if (sortType === 'down') {
            return goods.slice().sort((a, b) => b.price - a.price);
        } else {
            return goods;
        }
    }

    clearGoodsFromPage(teg: Component) {
        teg.root.innerHTML = '';
    }

    putGoodOnPage(teg: Component, goods: TGood[]) {
        goods.forEach((product) => {
            new Cart(teg.root, this.services, product);
        });
    }
}
