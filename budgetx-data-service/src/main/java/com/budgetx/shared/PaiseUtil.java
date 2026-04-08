package com.budgetx.shared;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class PaiseUtil {

    private static final BigDecimal MULTIPLIER = new BigDecimal("100");

    private PaiseUtil() {
        // Utility class
    }

    public static long toPaise(BigDecimal rupees) {
        if (rupees == null) return 0;
        return rupees.multiply(MULTIPLIER).setScale(0, RoundingMode.UNNECESSARY).longValue();
    }

    public static BigDecimal toRupees(long paise) {
        return BigDecimal.valueOf(paise).divide(MULTIPLIER, 2, RoundingMode.UNNECESSARY);
    }
}
