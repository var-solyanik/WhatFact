import DifferentFacts from '../Components/DifferentFacts';
import Game from '../Components/Game';
import Menu from '../Components/Menu';

export const Pages =[
    {path: '/menu', component: Menu},
    {path: '/', component: Menu},
    {path: '*', component: Menu},
    {path: '/facts', component: DifferentFacts},
    {path: '/game', component: Game},
]


