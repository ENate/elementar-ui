export interface LocalizedTimezone {
  id: string;
  name: string;
  shortName?: string;
  // genericName?: string; // Removed
  offsetName?: string;
}

export interface TimezoneGroup {
  name: string; // Changed from groupName
  timezones: LocalizedTimezone[];
}

export class TimezoneUtils {
  private static _groupTimezoneIds(timezones: string[]): Record<string, string[]> {
    const grouped: Record<string, string[]> = {};
    for (const tz of timezones) {
      const parts = tz.split('/');
      const groupName = parts[0];
      if (!grouped[groupName]) {
        grouped[groupName] = [];
      }
      grouped[groupName].push(tz);
    }
    for (const group in grouped) {
      grouped[group].sort();
    }
    return grouped;
  }

  private static _groupLocalizedTimezonesToArray(
    timezones: LocalizedTimezone[]
  ): TimezoneGroup[] {
    const intermediateGrouped: Record<string, LocalizedTimezone[]> = {};
    for (const tz of timezones) {
      const parts = tz.id.split('/');
      const groupNameKey = parts[0]; // Use a different variable name to avoid confusion with the 'name' property of TimezoneGroup
      if (!intermediateGrouped[groupNameKey]) {
        intermediateGrouped[groupNameKey] = [];
      }
      intermediateGrouped[groupNameKey].push(tz);
    }

    const result: TimezoneGroup[] = [];
    const sortedGroupKeys = Object.keys(intermediateGrouped).sort();

    for (const groupKey of sortedGroupKeys) {
      const timezonesInGroup = intermediateGrouped[groupKey];
      timezonesInGroup.sort((a, b) => a.name.localeCompare(b.name));
      result.push({
        name: groupKey, // Changed from groupName
        timezones: timezonesInGroup,
      });
    }
    return result;
  }

  public static getAll(groupByName: true): Record<string, string[]>;
  public static getAll(groupByName?: false): string[];
  public static getAll(groupByName?: boolean): string[] | Record<string, string[]> {
    let timezonesList: string[];
    if (typeof Intl.supportedValuesOf === 'function') {
      try {
        timezonesList = Intl.supportedValuesOf('timeZone');
      } catch (e) {
        timezonesList = [];
      }
    } else {
      timezonesList = [];
    }

    if (groupByName) {
      return TimezoneUtils._groupTimezoneIds(timezonesList);
    } else {
      return [...timezonesList];
    }
  }

  private static _getSingleLocalizedName(
    id: string,
    locale: string,
    style: 'long' | 'short' | 'shortOffset' | 'longOffset' | 'shortGeneric' | 'longGeneric', // Kept generic styles in param for flexibility if main name needs it
    currentDate: Date
  ): string | undefined {
    try {
      const formatter = new Intl.DateTimeFormat(locale, {
        timeZone: id,
        timeZoneName: style,
      });
      const parts = formatter.formatToParts(currentDate);
      const tzNamePart = parts.find(part => part.type === 'timeZoneName');
      return tzNamePart?.value;
    } catch (e) {
      return undefined;
    }
  }

  public static getLocalizedAll(
    locale: string,
    groupByName: true,
    timeZoneNameStyle?: 'long' | 'short' | 'shortOffset' | 'longOffset' | 'shortGeneric' | 'longGeneric'
  ): TimezoneGroup[];
  public static getLocalizedAll(
    locale: string,
    groupByName?: false,
    timeZoneNameStyle?: 'long' | 'short' | 'shortOffset' | 'longOffset' | 'shortGeneric' | 'longGeneric'
  ): LocalizedTimezone[];

  public static getLocalizedAll(
    locale: string,
    groupByName?: boolean,
    timeZoneNameStyle: 'long' | 'short' | 'shortOffset' | 'longOffset' | 'shortGeneric' | 'longGeneric' = 'long'
  ): LocalizedTimezone[] | TimezoneGroup[] {
    const ianaTimezoneIds = TimezoneUtils.getAll(false);
    const localizedTimezones: LocalizedTimezone[] = [];
    const currentDate = new Date();

    for (const id of ianaTimezoneIds) {
      const mainName = TimezoneUtils._getSingleLocalizedName(id, locale, timeZoneNameStyle, currentDate);

      const tzObject: LocalizedTimezone = {
        id: id,
        name: mainName || id,
        shortName: TimezoneUtils._getSingleLocalizedName(id, locale, 'short', currentDate),
        offsetName: TimezoneUtils._getSingleLocalizedName(id, locale, 'longOffset', currentDate),
      };
      localizedTimezones.push(tzObject);
    }

    if (groupByName) {
      return TimezoneUtils._groupLocalizedTimezonesToArray(localizedTimezones);
    } else {
      localizedTimezones.sort((a, b) => a.name.localeCompare(b.name));
      return localizedTimezones;
    }
  }
}
