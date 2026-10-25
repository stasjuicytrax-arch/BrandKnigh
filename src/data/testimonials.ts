// Отзывы («Благодарности»). Пока заказчик не прислал реальные тексты, массив пуст — секция и пункт меню не выводятся.
export type Testimonial = { text: string; name: string; role: string; photo?: string };
export const testimonials: Testimonial[] = [];
