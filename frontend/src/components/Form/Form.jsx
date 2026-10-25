import { useForm } from 'react-hook-form';
import InputMask from 'react-input-mask';
import { useState } from 'react';
import s from './Form.module.css';

export const MainForm = ({ phoneHref }) => {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async data => {
    setLoading(true);
    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, phone: data.phone }),
      });
      setSent(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      reset();
      setValue('phone', '');
    }
  };

  if (sent) {
    return (
      <div className={s.card}>
        <div className={s.success}>
          <span className={s.checkCircle}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </span>
          <h3 className={s.successTitle}>Заявка принята</h3>
          <p className={s.successNote}>
            Перезвоним в рабочее время. Если нужно срочно — звоните сами.
          </p>
          <a href={phoneHref} className={s.callBtn}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Позвонить сейчас
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={s.card}>
      <form onSubmit={handleSubmit(onSubmit)} className={s.form} noValidate>
        <h3 className={s.formTitle}>Заявка на подбор оборудования</h3>

        <div className={s.field}>
          <label className={s.label} htmlFor="name">Имя</label>
          <div className={s.inputWrap}>
            <span className={s.inputIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </span>
            <input
              id="name"
              type="text"
              placeholder="Как к вам обращаться"
              className={`${s.input} ${errors.name ? s.inputError : ''}`}
              autoComplete="name"
              {...register('name', {
                required: 'Укажите имя',
                minLength: { value: 2, message: 'Минимум 2 символа' },
              })}
            />
          </div>
          {errors.name && <span className={s.error}>{errors.name.message}</span>}
        </div>

        <div className={s.field}>
          <label className={s.label} htmlFor="phone">Телефон</label>
          <div className={s.inputWrap}>
            <span className={s.inputIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </span>
            <InputMask
              mask="+7 999 999-99-99"
              alwaysShowMask={false}
              {...register('phone', {
                required: 'Укажите номер телефона',
                validate: v => v.replace(/\D/g, '').length >= 10 || 'Введите полный номер',
              })}
            >
              {inputProps => (
                <input
                  {...inputProps}
                  id="phone"
                  type="tel"
                  placeholder="+7 978 000-00-00"
                  className={`${s.input} ${errors.phone ? s.inputError : ''}`}
                  autoComplete="tel"
                />
              )}
            </InputMask>
          </div>
          {errors.phone && <span className={s.error}>{errors.phone.message}</span>}
        </div>

        <label className={s.consentLabel}>
          <input
            type="checkbox"
            className={s.consentCheck}
            {...register('consent', { required: 'Необходимо согласие на обработку данных' })}
          />
          <span className={s.consentText}>
            Я согласен(а) на обработку персональных данных в соответствии с{' '}
            <a href="/privacy" target="_blank" rel="noopener" className={s.consentLink}>
              Политикой конфиденциальности
            </a>
          </span>
        </label>
        {errors.consent && <span className={s.error}>{errors.consent.message}</span>}

        <button type="submit" className={s.submit} disabled={loading}>
          {loading ? 'Отправляем...' : 'Отправить заявку'}
        </button>
        <p className={s.privacy}>
          Перезвоним в рабочее время. Номер используем только для этого звонка.
        </p>
      </form>
    </div>
  );
};
