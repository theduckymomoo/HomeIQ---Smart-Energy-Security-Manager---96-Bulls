import * as React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react-native";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
  style?: any;
  children: React.ReactNode;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

const Carousel = React.forwardRef<View, CarouselProps>(
  (
    {
      orientation = "horizontal",
      opts,
      setApi,
      plugins,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = React.useCallback(() => {
      api?.scrollNext();
    }, [api]);

    React.useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    React.useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <View
          ref={ref}
          style={[styles.container, style]}
          accessible={true}
          accessibilityRole="adjustable"
          {...props}
        >
          {children}
        </View>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

const CarouselContent = React.forwardRef<View, { style?: any; children: React.ReactNode }>(
  ({ style, children, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();

    return (
      <View ref={carouselRef} style={styles.overflowHidden}>
        <View
          ref={ref}
          style={[
            styles.flex,
            orientation === "horizontal" ? styles.horizontalContent : styles.verticalContent,
            style,
          ]}
          {...props}
        >
          {children}
        </View>
      </View>
    );
  }
);
CarouselContent.displayName = "CarouselContent";

const CarouselItem = React.forwardRef<View, { style?: any; children: React.ReactNode }>(
  ({ style, children, ...props }, ref) => {
    const { orientation } = useCarousel();

    return (
      <View
        ref={ref}
        accessibilityRole="adjustable"
        style={[
          styles.item,
          orientation === "horizontal" ? styles.horizontalItem : styles.verticalItem,
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    );
  }
);
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = React.forwardRef<TouchableOpacity, {
  style?: any;
  disabled?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}>(({ style, disabled, onPress, ...props }, ref) => {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <TouchableOpacity
      ref={ref}
      style={[
        styles.button,
        orientation === "horizontal"
          ? styles.horizontalPrev
          : styles.verticalPrev,
        style,
        disabled && styles.disabled,
      ]}
      disabled={!canScrollPrev || disabled}
      onPress={() => {
        scrollPrev();
        onPress?.();
      }}
      accessibilityLabel="Previous slide"
      {...props}
    >
      <ArrowLeft size={16} />
    </TouchableOpacity>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = React.forwardRef<TouchableOpacity, {
  style?: any;
  disabled?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}>(({ style, disabled, onPress, ...props }, ref) => {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <TouchableOpacity
      ref={ref}
      style={[
        styles.button,
        orientation === "horizontal"
          ? styles.horizontalNext
          : styles.verticalNext,
        style,
        disabled && styles.disabled,
      ]}
      disabled={!canScrollNext || disabled}
      onPress={() => {
        scrollNext();
        onPress?.();
      }}
      accessibilityLabel="Next slide"
      {...props}
    >
      <ArrowRight size={16} />
    </TouchableOpacity>
  );
});
CarouselNext.displayName = "CarouselNext";

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  overflowHidden: {
    overflow: "hidden",
  },
  flex: {
    flexDirection: "row",
  },
  horizontalContent: {
    marginLeft: -16,
  },
  verticalContent: {
    marginTop: -16,
    flexDirection: "column",
  },
  item: {
    minWidth: 0,
    flexShrink: 0,
    flexGrow: 0,
    flexBasis: "100%",
  },
  horizontalItem: {
    paddingLeft: 16,
  },
  verticalItem: {
    paddingTop: 16,
  },
  button: {
    position: "absolute",
    height: 32,
    width: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  horizontalPrev: {
    left: -48,
    top: "50%",
    transform: [{ translateY: -16 }],
  },
  horizontalNext: {
    right: -48,
    top: "50%",
    transform: [{ translateY: -16 }],
  },
  verticalPrev: {
    top: -48,
    left: "50%",
    transform: [{ translateX: -16 }, { rotate: "90deg" }],
  },
  verticalNext: {
    bottom: -48,
    left: "50%",
    transform: [{ translateX: -16 }, { rotate: "90deg" }],
  },
  disabled: {
    opacity: 0.5,
  },
});

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};