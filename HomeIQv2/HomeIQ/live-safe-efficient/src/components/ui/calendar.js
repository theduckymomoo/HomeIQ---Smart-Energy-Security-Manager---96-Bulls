import * as React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

// Note: You'll need to use a React Native date picker library instead of react-day-picker
// For example: react-native-calendars, react-native-date-picker, or create a custom one

const Calendar = ({
  style,
  showOutsideDays = true,
  onDayPress,
  selectedDate,
  ...props
}) => {
  // This is a simplified implementation since react-day-picker is web-only
  // You might want to use a proper React Native calendar library
  
  const [currentDate, setCurrentDate] = React.useState(selectedDate || new Date());
  
  const navigateMonth = (months) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + months);
    setCurrentDate(newDate);
  };

  const renderHeader = () => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <TouchableOpacity
          onPress={() => navigateMonth(-1)}
          style={{
            width: 28,
            height: 28,
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.5,
          }}
        >
          <ChevronLeft size={16} color="#6b7280" />
        </TouchableOpacity>
        
        <Text style={{ fontSize: 16, fontWeight: "600" }}>
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
        
        <TouchableOpacity
          onPress={() => navigateMonth(1)}
          style={{
            width: 28,
            height: 28,
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.5,
          }}
        >
          <ChevronRight size={16} color="#6b7280" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderWeekDays = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <View style={{ flexDirection: "row", marginBottom: 8 }}>
        {weekDays.map((day) => (
          <View key={day} style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 12, color: "#6b7280", fontWeight: "500" }}>
              {day}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderDays = () => {
    // Simplified calendar grid implementation
    const days = [];
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    for (let i = 0; i < startDay; i++) {
      days.push(<View key={`empty-${i}`} style={{ flex: 1, height: 36 }} />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isSelected = selectedDate && dayDate.toDateString() === selectedDate.toDateString();
      const isToday = dayDate.toDateString() === new Date().toDateString();
      
      days.push(
        <TouchableOpacity
          key={day}
          onPress={() => onDayPress?.(dayDate)}
          style={{
            flex: 1,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isSelected ? "#007AFF" : isToday ? "#f3f4f6" : "transparent",
            borderRadius: 18,
            margin: 2,
          }}
        >
          <Text style={{
            color: isSelected ? "white" : isToday ? "#007AFF" : "black",
            fontWeight: isSelected || isToday ? "600" : "400",
            fontSize: 14,
          }}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }
    
    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {days}
      </View>
    );
  };

  return (
    <View style={[{ padding: 16, backgroundColor: "white", borderRadius: 12 }, style]}>
      {renderHeader()}
      {renderWeekDays()}
      {renderDays()}
    </View>
  );
};

Calendar.displayName = "Calendar";

export { Calendar };