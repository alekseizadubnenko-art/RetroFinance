import React from 'react';
import { Card, Button } from './ui/RetroComponents';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useData } from '../context/DataContext';

const graphData = [
    { date: '01.11', value: 800 },
    { date: '15.11', value: 1200 },
    { date: '01.12', value: 2100 },
    { date: '15.12', value: 2900 },
    { date: '01.01', value: 2953 },
];

export const Investments: React.FC = () => {
    const { investments } = useData();
    
    const totalInvested = investments.reduce((acc, i) => acc + i.invested, 0);
    const totalCurrent = investments.reduce((acc, i) => acc + i.currentValue, 0);
    const totalProfit = totalCurrent - totalInvested;
    const profitPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

    return (
        <div className="flex flex-col gap-8">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight">Инвестиции</h2>
                    <p className="text-xs font-bold uppercase tracking-wider mt-1 text-gray-600">Отслеживание портфелей и прибыли</p>
                </div>
                <Button variant="primary" icon="add">Добавить портфель</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="flex flex-col justify-between min-h-[120px]">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-70">Всего вложено</span>
                    <div className="text-3xl font-bold mt-2 font-mono">₽{totalInvested.toLocaleString()}</div>
                </Card>
                 <Card className="flex flex-col justify-between min-h-[120px]">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-70">Текущая стоимость</span>
                    <div className="text-3xl font-bold mt-2 font-mono">₽{totalCurrent.toLocaleString()}</div>
                </Card>
                 <Card color="retro" className="flex flex-col justify-between min-h-[120px]">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-70">Прибыль / Убыток</span>
                    <div className={`text-3xl font-bold mt-2 font-mono ${totalProfit >= 0 ? 'text-accent-orange' : 'text-retro-action'}`}>
                        {totalProfit >= 0 ? '+' : ''}₽{totalProfit.toLocaleString()}
                    </div>
                </Card>
                 <Card color="retro" className="flex flex-col justify-between min-h-[120px]">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-70">Доходность</span>
                    <div className={`text-3xl font-bold mt-2 font-mono ${profitPercent >= 0 ? 'text-accent-orange' : 'text-retro-action'}`}>
                         {profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                    </div>
                </Card>
            </div>

            <Card className="mb-8">
                <div className="border-b-2 border-retro-border bg-white flex justify-between items-center cursor-pointer mb-6 pb-4">
                    <h3 className="font-bold uppercase text-lg">Портфели</h3>
                    <span className="material-symbols-outlined">expand_less</span>
                </div>
                 <div className="flex flex-col gap-6">
                     {investments.length > 0 ? investments.map(inv => (
                        <div key={inv.id} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 pb-6 border-b-2 border-dashed border-gray-200 last:border-0 last:pb-0 last:mb-0">
                            <div className="md:col-span-4 font-bold text-lg uppercase">{inv.name}</div>
                            <div className="border-2 border-retro-border p-4 bg-white">
                                <span className="text-xs font-bold uppercase tracking-wider block mb-2">Вложено</span>
                                <span className="text-xl font-bold font-mono">₽{inv.invested.toLocaleString()}</span>
                            </div>
                            <div className="border-2 border-retro-border p-4 bg-white">
                                <span className="text-xs font-bold uppercase tracking-wider block mb-2">Текущий баланс</span>
                                <span className="text-xl font-bold font-mono">₽{inv.currentValue.toLocaleString()}</span>
                            </div>
                            <div className="border-2 border-retro-border p-4 bg-card-retro">
                                <span className="text-xs font-bold uppercase tracking-wider block mb-2">Прибыль</span>
                                <span className="text-xl font-bold font-mono text-accent-orange">+₽{inv.profit.toLocaleString()}</span>
                            </div>
                            <div className="border-2 border-retro-border p-4 bg-card-retro">
                                <span className="text-xs font-bold uppercase tracking-wider block mb-2">Доходность</span>
                                <span className="text-xl font-bold font-mono text-accent-orange">+{inv.percent}%</span>
                            </div>
                        </div>
                     )) : (
                         <div className="text-center text-gray-500 font-bold uppercase">Нет портфелей</div>
                     )}
                     
                     {/* Static Graph for demo visuals */}
                     <div className="border-2 border-retro-border p-6 bg-white relative min-h-[300px]">
                        <h4 className="font-bold uppercase text-xs mb-6">График изменения (Демо)</h4>
                        <div className="h-[220px] w-full mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={graphData}>
                                    <XAxis 
                                        dataKey="date" 
                                        stroke="#111418" 
                                        tick={{fill: '#111418', fontSize: 12, fontFamily: 'JetBrains Mono'}} 
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis 
                                        stroke="#111418" 
                                        tick={{fill: '#111418', fontSize: 12, fontFamily: 'JetBrains Mono'}} 
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '2px solid #111418',
                                            boxShadow: '4px 4px 0px 0px #111418',
                                            fontFamily: 'JetBrains Mono'
                                        }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="#e85d04" 
                                        strokeWidth={3} 
                                        dot={{fill: 'white', stroke: '#e85d04', strokeWidth: 2, r: 4}} 
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                     </div>
                 </div>
            </Card>
        </div>
    );
};