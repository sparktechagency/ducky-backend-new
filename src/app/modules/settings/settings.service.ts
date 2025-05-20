import mongoose from 'mongoose';
import Settings from './settings.model';
import { ISettings } from './settings.interface.js';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';

const addSettings = async (data: Partial<ISettings>): Promise<ISettings> => {
  const existingSettings = await Settings.findOne({});
  if (existingSettings) {
    return existingSettings;
  } else {
    const result = await Settings.create(data);

    if (!result) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to add music');
    }
    return result;
  }
};

const getSettings = async (
  title?: keyof ISettings,
): Promise<{ content?: string } | ISettings | null> => {
  const settings = await Settings.findOne().select(title as string);

  if (title) {
    return { content: settings ? settings[title] : undefined }; // Check if settings exists
  } else {
    return settings;
  }
};

// Function to update settings without needing an ID
const updateSettings = async (
  settingsBody: Partial<ISettings>,
): Promise<ISettings | null> => {
  // Find the existing settings document and update it
  const settings = await Settings.findOneAndUpdate({}, settingsBody, {
    new: true,
  });

  return settings;
};

export const settingsService = {
  addSettings,
  updateSettings,
  getSettings,
};
