import {Component} from '../Abstract/Component';
import { Graph } from '../Abstract/Graph';
import { THistory, TServices } from '../Abstract/Types';
import { ItemHistory } from '../Common/ItemHistory';

export class HistoryPage extends Component {
    private graphic: Component | null = null; 
    private graph: Graph | null = null;
    private history: THistory[] | null = null;
    constructor(parrent: HTMLElement,private services: TServices){
        super(parrent, 'div');
        const container = new Component(this.root, 'div', ['container']);
        const historypage = new Component(container.root, 'div', ['historypage'], '');
        services.dbService.getDataUser(services.authService.user).then(()=>{
        const profile = new Component(historypage.root, 'div', ['profile']);
        new Component (profile.root, "h1", null, 'Мой профиль');
        new Component(profile.root, 'h3', null, 'Логин: <span>' + this.services.authService.user?.displayName + '</span>');
        new Component(profile.root, "h3", null, 'E-mail: <span>' + this.services.authService.user?.email + '</span>');
        const pdiv = new Component(profile.root, 'div', ['pdiv']);
        const Phone = new Component(pdiv.root, 'h3', null, 'Телефон ');
        const number = new Component(Phone.root, 'span', null, this.services.dbService.dataUser?.phone? this.services.dbService.dataUser?.phone.toString() :  'Указать');
        number.root.onclick = () =>{
            if (!pdiv.root.querySelector('.pi')) {
                const numbin = new Component(pdiv.root, 'input', ['pi'], '', ['placeholder'], ['Введите номер телефона']);
                const numbtn = new Component(pdiv.root, 'button', ['pb'], '✅');
                numbtn.root.onclick = () =>{
                    if (this.services.dbService.dataUser) {
                        this.services.dbService.updatePhoneNumber(this.services.authService.user, (numbin.root as HTMLInputElement).value);
                        number.root.innerText = (numbin.root as HTMLInputElement).value;
                        numbin.remove();
                        numbtn.remove();
                    }                    
                }
            }
        }
        const historyb = new Component(historypage.root, 'div', ['graphic']);
        new Component(historyb.root, 'h1', null, 'История заказов');
        const historyd = new Component(historyb.root, 'div', null);
        services.dbService.getHistory(this.services.authService.user).then((history) => {
            this.history = history;
            this.putHistoryOnPage(historyd, history);
        });
        services.dbService.getDataUser(services.authService.user).then(async () => {
            const history = await services.dbService.getHistory(this.services.authService.user);
        });
        const ordcount = new Component(profile.root, 'p', null, 'Количество заказов: <span>0 рублей</span>');
        const ordsum = new Component(profile.root, 'p', null, 'Сумма заказов: <span>0 рублей</span>');
        this.services.dbService.addListener('changeStat', (summa, count)=>{
            ordcount.root.innerHTML = 'Количество заказов: <span>' + summa?.toString() +' </span>';
            ordsum.root.innerHTML = 'Сумма заказов: <span>' + count?.toString() + ' руб.</span>';
            historyd.root.innerHTML = '';
            services.dbService.getDataUser(services.authService.user).then(async () => {
                const history = await services.dbService.getHistory(this.services.authService.user);
                const updatedData = services.dbService.updateDataGraph(history);
                this.putHistoryOnPage(historyd, history);
            });
        });
        services.dbService.getCountHistory(this.services.authService.user);
        });
    }

    putHistoryOnPage(tag: Component, history: THistory[]) {
        history.forEach((product) =>{
            new ItemHistory(tag.root, this.services, product);
        })
    }
}