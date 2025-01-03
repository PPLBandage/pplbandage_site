# Новый способ загрузки повязок

Обновленный метод загрузки повязок значительно удобнее предыдущего и автоматизирует процесс загрузки повязки с развертки скина. 

### Создание повязки
Для создания повязки можно использовать любые редакторы скинов, такие как Blockbench. Чтобы сайт корректно распознал повязку, её следует размещать на левой руке с широкой (или узкой) моделью. 

Важно: так как движок автоматически определяет высоту повязки, на руке с повязкой не должно быть лишних непрозрачных пикселей. Они могут помешать точному определению высоты.

### Как это работает?
1. **Определение границ высоты**:
   - Сайт анализирует пиксели на руке сверху вниз, проверяя их на прозрачность.
   - Как только найден первый непрозрачный пиксель, его позиция фиксируется как начальная высота повязки.
   - Затем сайт движется снизу вверх. Первый непрозрачный пиксель снизу фиксируется как конечная высота повязки.
2. **Вычисление высоты**:  
   Разница между конечной и начальной высотами определяет высоту повязки.
3. **Обработка повязки**:  
   Найденный диапазон преобразуется в формат, понятный движку.

### Особенности для разных типов рук
Загружая развертки скинов на сайт стоит учитывать, что для каждого типа рук должна быть соответствующая развертка.