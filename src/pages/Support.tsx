import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

const tiers = [
  { label: 'Кофе', amount: '100 ₽', icon: '☕', desc: 'Маленький знак внимания', popular: false },
  { label: 'Поддержка', amount: '500 ₽', icon: '🎵', desc: 'Помогает оплатить сервер', popular: true },
  { label: 'Спонсор', amount: '1 500 ₽', icon: '🏆', desc: 'Вы — настоящий меценат', popular: false },
];

export default function Support() {
  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="text-5xl mb-4">💛</div>
        <h1 className="font-display text-4xl font-bold uppercase tracking-wide mb-3">Поддержите проект</h1>
        <p className="text-muted-foreground leading-relaxed">
          РадиоРоссии — некоммерческий проект. Ваша поддержка помогает<br className="hidden sm:block" />
          оплачивать серверы и добавлять новые станции.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-10">
        {[
          { label: 'Станций в каталоге', value: '10+' },
          { label: 'Часов в эфире', value: '∞' },
          { label: 'Довольных слушателей', value: '❤️' },
        ].map(s => (
          <div key={s.label} className="text-center p-4 rounded-2xl bg-card border border-border">
            <div className="font-display text-2xl font-bold text-primary mb-1">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tiers */}
      <div className="grid gap-3 mb-8">
        {tiers.map(t => (
          <button
            key={t.label}
            className={cn(
              "relative flex items-center gap-4 p-5 rounded-2xl border text-left transition-all group",
              "hover:border-primary/50 hover:bg-primary/5",
              t.popular
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-card"
            )}
          >
            {t.popular && (
              <span className="absolute top-3 right-3 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] font-bold rounded uppercase tracking-wide">
                Популярно
              </span>
            )}
            <span className="text-3xl">{t.icon}</span>
            <div className="flex-1">
              <div className="font-semibold text-sm mb-0.5">{t.label}</div>
              <div className="text-xs text-muted-foreground">{t.desc}</div>
            </div>
            <div className="font-display text-xl font-bold text-primary">{t.amount}</div>
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="p-5 rounded-2xl border border-border bg-card mb-6">
        <p className="text-sm text-muted-foreground mb-3">Или введите свою сумму:</p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              placeholder="Сумма"
              className="w-full pl-4 pr-10 py-3 rounded-xl bg-secondary border border-border text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₽</span>
          </div>
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
            Поддержать
          </button>
        </div>
      </div>

      {/* Note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary border border-border text-sm text-muted-foreground">
        <Icon name="Info" size={16} className="shrink-0 mt-0.5 text-primary" />
        <p>Кнопки оплаты можно подключить к ЮKassa, Stripe или T-Pay. Напишите нам — подключим нужную систему.</p>
      </div>
    </div>
  );
}
