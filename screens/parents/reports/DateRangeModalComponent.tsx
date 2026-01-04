import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

interface CustomDateRangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRange: (startDate: Date, endDate: Date) => void;
}

const CustomDateRangeModal = ({
  isOpen,
  onClose,
  onSelectRange,
}: CustomDateRangeModalProps) => {
  const [selectedMonth, setSelectedMonth] = useState(10); // November (0-indexed)
  const [selectedYear, setSelectedYear] = useState(2025);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Adjust so Monday is 0
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days: (number | null)[] = [];

    // Add empty slots for days before the first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handleDatePress = (day: number | null) => {
    if (!day) return;

    const selectedDate = new Date(selectedYear, selectedMonth, day);

    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(selectedDate);
      setEndDate(null);
    } else if (startDate && !endDate) {
      // Set end date
      if (selectedDate < startDate) {
        setEndDate(startDate);
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    }
  };

  const isDateInRange = (day: number | null): boolean => {
    if (!day || !startDate) return false;

    const date = new Date(selectedYear, selectedMonth, day);

    if (!endDate) {
      return date.getTime() === startDate.getTime();
    }

    return date >= startDate && date <= endDate;
  };

  const isStartDate = (day: number | null): boolean => {
    if (!day || !startDate) return false;
    const date = new Date(selectedYear, selectedMonth, day);
    return date.getTime() === startDate.getTime();
  };

  const isEndDate = (day: number | null): boolean => {
    if (!day || !endDate) return false;
    const date = new Date(selectedYear, selectedMonth, day);
    return date.getTime() === endDate.getTime();
  };

  const handleContinue = () => {
    if (startDate && endDate) {
      onSelectRange(startDate, endDate);
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()].slice(0, 3);
    const year = date.getFullYear().toString().slice(-2);
    return `${day} ${month} ${year}`;
  };

  const calendarDays = generateCalendarDays();

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType='slide'
      onRequestClose={onClose}
    >
      <View className='flex-1 justify-end bg-black/50'>
        <View className='bg-white rounded-t-3xl px-6 py-8'>
          {/* Handle bar */}
          <View className='w-12 h-1 bg-gray-300 rounded-full self-center mb-6' />

          {/* Title */}
          <Text className='text-2xl font-bold text-center mb-2'>
            Select Date Range
          </Text>
          <Text className='text-center text-gray-600 mb-6'>
            You can select a maximum date range of 90 days.
          </Text>

          {/* Date Range Display */}
          <View className='flex flex-row items-center justify-center gap-x-4 mb-6'>
            <View className='border-2 border-gray-300 rounded-full px-6 py-3'>
              <Text className='text-base font-[abeezee]'>
                {startDate ? formatDate(startDate) : 'Start Date'}
              </Text>
            </View>
            <Text className='text-xl'>-</Text>
            <View className='border-2 border-gray-300 rounded-full px-6 py-3'>
              <Text className='text-base font-[abeezee]'>
                {endDate ? formatDate(endDate) : 'End Date'}
              </Text>
            </View>
          </View>

          {/* Month and Year Selectors */}
          <View className='flex flex-row justify-between items-center mb-6'>
            <View className='flex flex-row items-center gap-x-2'>
              <Text className='text-lg font-[abeezee]'>
                {months[selectedMonth]}
              </Text>
              <ChevronDown size={20} />
            </View>
            <View className='flex flex-row items-center gap-x-2'>
              <Text className='text-lg font-[abeezee]'>{selectedYear}</Text>
              <ChevronDown size={20} />
            </View>
          </View>

          {/* Days of Week */}
          <View className='flex flex-row justify-around mb-4'>
            {daysOfWeek.map((day) => (
              <Text
                key={day}
                className='text-gray-500 text-sm font-[abeezee] w-10 text-center'
              >
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View className='flex flex-row flex-wrap mb-6'>
            {calendarDays.map((day, index) => {
              const isInRange = isDateInRange(day);
              const isStart = isStartDate(day);
              const isEnd = isEndDate(day);

              return (
                <Pressable
                  key={index}
                  onPress={() => handleDatePress(day)}
                  disabled={!day}
                  className='w-[14.28%] aspect-square items-center justify-center'
                >
                  {day && (
                    <View
                      className={`w-10 h-10 items-center justify-center rounded-full ${
                        isStart || isEnd
                          ? 'bg-[#6B5FE8]'
                          : isInRange
                            ? 'bg-[#D4D4F4]'
                            : ''
                      }`}
                    >
                      <Text
                        className={`text-base font-[abeezee] ${
                          isStart || isEnd
                            ? 'text-white font-bold'
                            : isInRange
                              ? 'text-[#6B5FE8]'
                              : 'text-black'
                        } ${!day ? 'text-gray-300' : ''}`}
                      >
                        {day || ''}
                      </Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {/* Action Buttons */}
          <View className='flex flex-col gap-y-3'>
            <Pressable
              onPress={handleContinue}
              disabled={!startDate || !endDate}
              className={`py-4 rounded-full ${
                startDate && endDate ? 'bg-[#FF6B4A]' : 'bg-gray-300'
              }`}
            >
              <Text className='text-white text-center text-base font-[abeezee] font-bold'>
                Continue
              </Text>
            </Pressable>
            <Pressable
              onPress={onClose}
              className='py-4 rounded-full border-2 border-gray-300'
            >
              <Text className='text-black text-center text-base font-[abeezee]'>
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomDateRangeModal;
