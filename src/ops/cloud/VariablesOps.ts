import {
  deleteVariable as _deleteVariable,
  getVariable as _getVariable,
  getVariables as _getVariables,
  putVariable as _putVariable,
  setVariableDescription as _setVariableDescription,
  VariableExpressionType,
  VariableSkeleton,
} from '../../api/cloud/VariablesApi';
import { State } from '../../shared/State';
import { decode } from '../../utils/Base64Utils';
import {
  createProgressIndicator,
  debugMessage,
  stopProgressIndicator,
  updateProgressIndicator,
} from '../../utils/Console';
import { getMetadata } from '../../utils/ExportImportUtils';
import { FrodoError } from '../FrodoError';
import { ExportMetaData } from '../OpsTypes';

export type Variable = {
  /**
   * Read variable by id/name
   * @param {string} variableId variable id/name
   * @returns {Promise<VariableSkeleton>} a promise that resolves to a variable object
   */
  readVariable(variableId: string): Promise<VariableSkeleton>;
  /**
   * Read all variables
   * @returns {Promise<VariableSkeleton[]>} a promise that resolves to an array of variable objects
   */
  readVariables(): Promise<VariableSkeleton[]>;
  /**
   * Export variable. The response can be saved to file as is.
   * @param variableId variable id/name
   * @param noDecode Do not include decoded variable value in export
   * @returns {Promise<VariablesExportInterface>} Promise resolving to a VariablesExportInterface object.
   */
  exportVariable(
    variableId: string,
    noDecode: boolean
  ): Promise<VariablesExportInterface>;
  /**
   * Export all variables
   * @param noDecode Do not include decoded variable value in export
   * @returns {Promise<VariablesExportInterface>} Promise resolving to an VariablesExportInterface object.
   */
  exportVariables(noDecode: boolean): Promise<VariablesExportInterface>;
  /**
   * Import variable by id
   * @param {string} policyId policy id
   * @param {VariablesExportInterface} importData import data
   * @returns {Promise<VariableSkeleton>} imported variable object
   */
  importVariable(
    variableId: string,
    importData: VariablesExportInterface
  ): Promise<VariableSkeleton>;
  /**
   * Import variables
   * @param {VariablesExportInterface} importData import data
   * @returns {Promise<VariableSkeleton[]>} array of imported variable objects
   */
  importVariables(
    importData: VariablesExportInterface
  ): Promise<VariableSkeleton[]>;
  /**
   * Create variable
   * @param {string} variableId variable id/name
   * @param {string} value variable value
   * @param {string} description variable description
   * @param {VariableExpressionType} expressionType type of the value
   * @returns {Promise<VariableSkeleton>} a promise that resolves to a variable object
   */
  createVariable(
    variableId: string,
    value: string,
    description: string,
    expressionType?: VariableExpressionType
  ): Promise<VariableSkeleton>;
  /**
   * Update or create variable
   * @param {string} variableId variable id/name
   * @param {string} value variable value
   * @param {string} description variable description
   * @param {VariableExpressionType} expressionType type of the value
   * @returns {Promise<VariableSkeleton>} a promise that resolves to a variable object
   */
  updateVariable(
    variableId: string,
    value: string,
    description: string,
    expressionType?: VariableExpressionType
  ): Promise<VariableSkeleton>;
  /**
   * Update variable description
   * @param {string} variableId variable id/name
   * @param {string} description variable description
   * @returns {Promise<VariableSkeleton>} a promise that resolves to a status object
   */
  updateVariableDescription(
    variableId: string,
    description: string
  ): Promise<VariableSkeleton>;
  /**
   * Delete variable by id/name
   * @param {string} variableId variable id/name
   * @returns {Promise<VariableSkeleton>} a promise that resolves to a variable object
   */
  deleteVariable(variableId: string): Promise<VariableSkeleton>;

  // Deprecated

  /**
   * Get variable by id/name
   * @param {string} variableId variable id/name
   * @returns {Promise<VariableSkeleton>} a promise that resolves to a variable object
   * @deprecated since v2.0.0 use {@link Variable.readVariable | readVariable} instead
   * ```javascript
   * readVariable(variableId: string): Promise<VariableSkeleton>
   * ```
   * @group Deprecated
   */
  getVariable(variableId: string): Promise<VariableSkeleton>;
  /**
   * Get all variables
   * @returns {Promise<VariableSkeleton[]>} a promise that resolves to an array of variable objects
   * @deprecated since v2.0.0 use {@link Variable.readVariables | readVariables} instead
   * ```javascript
   * readVariables(): Promise<VariableSkeleton[]>
   * ```
   * @group Deprecated
   */
  getVariables(): Promise<VariableSkeleton[]>;
  /**
   * Create variable
   * @param {string} variableId variable id/name
   * @param {string} value variable value
   * @param {string} description variable description
   * @param {VariableExpressionType} expressionType type of the value
   * @returns {Promise<VariableSkeleton>} a promise that resolves to a variable object
   * @deprecated since v2.0.0 use {@link Variable.createVariable | createVariable} instead
   * ```javascript
   * createVariable(variableId: string, value: string, description: string, expressionType?: VariableExpressionType): Promise<VariableSkeleton>
   * ```
   * @group Deprecated
   */
  putVariable(
    variableId: string,
    value: string,
    description: string,
    expressionType?: VariableExpressionType
  ): Promise<VariableSkeleton>;
  /**
   * Set variable description
   * @param {string} variableId variable id/name
   * @param {string} description variable description
   * @returns {Promise<any>} a promise that resolves to an empty string
   * @deprecated since v2.0.0 use {@link Variable.updateVariableDescription | updateVariableDescription} instead
   * ```javascript
   * updateVariableDescription(variableId: string, description: string): Promise<any>
   * ```
   * @group Deprecated
   */
  setVariableDescription(variableId: string, description: string): Promise<any>;
};

export default (state: State): Variable => {
  return {
    async readVariable(variableId: string): Promise<VariableSkeleton> {
      return readVariable({ variableId, state });
    },
    async readVariables(): Promise<VariableSkeleton[]> {
      return readVariables({ state });
    },
    async exportVariable(
      variableId: string,
      noDecode: boolean
    ): Promise<VariablesExportInterface> {
      return exportVariable({ variableId, noDecode, state });
    },
    async exportVariables(
      noDecode: boolean
    ): Promise<VariablesExportInterface> {
      return exportVariables({ noDecode, state });
    },
    async importVariable(
      variableId: string,
      importData: VariablesExportInterface
    ): Promise<VariableSkeleton> {
      return importVariable({ variableId, importData, state });
    },
    async importVariables(
      importData: VariablesExportInterface
    ): Promise<VariableSkeleton[]> {
      return importVariables({ importData, state });
    },
    async createVariable(
      variableId: string,
      value: string,
      description: string,
      expressionType: VariableExpressionType = 'string'
    ): Promise<VariableSkeleton> {
      return createVariable({
        variableId,
        value,
        description,
        expressionType,
        state,
      });
    },
    async updateVariable(
      variableId: string,
      value: string,
      description: string,
      expressionType: VariableExpressionType = 'string'
    ): Promise<VariableSkeleton> {
      return updateVariable({
        variableId,
        value,
        description,
        expressionType,
        state,
      });
    },
    async updateVariableDescription(
      variableId: string,
      description: string
    ): Promise<any> {
      return updateVariableDescription({
        variableId,
        description,
        state,
      });
    },
    async deleteVariable(variableId: string): Promise<VariableSkeleton> {
      return deleteVariable({ variableId, state });
    },

    // Deprecated

    async getVariable(variableId: string): Promise<VariableSkeleton> {
      return readVariable({ variableId, state });
    },
    async getVariables(): Promise<VariableSkeleton[]> {
      return readVariables({ state });
    },
    async putVariable(
      variableId: string,
      value: string,
      description: string,
      expressionType: VariableExpressionType = 'string'
    ): Promise<VariableSkeleton> {
      return updateVariable({
        variableId,
        value,
        description,
        expressionType,
        state,
      });
    },
    async setVariableDescription(
      variableId: string,
      description: string
    ): Promise<any> {
      return updateVariableDescription({
        variableId,
        description,
        state,
      });
    },
  };
};

export interface VariablesExportInterface {
  meta?: ExportMetaData;
  variables: Record<string, VariableSkeleton>;
}

export function createVariablesExportTemplate({
  state,
}: {
  state: State;
}): VariablesExportInterface {
  return {
    meta: getMetadata({ state }),
    variables: {},
  } as VariablesExportInterface;
}

export async function readVariable({
  variableId,
  state,
}: {
  variableId: string;
  state: State;
}): Promise<VariableSkeleton> {
  try {
    return _getVariable({ variableId, state });
  } catch (error) {
    throw new FrodoError(`Error reading variable ${variableId}`, error);
  }
}

export async function readVariables({
  state,
}: {
  state: State;
}): Promise<VariableSkeleton[]> {
  try {
    return (await _getVariables({ state })).result;
  } catch (error) {
    throw new FrodoError(`Error reading variables`, error);
  }
}

export async function exportVariable({
  variableId,
  noDecode,
  state,
}: {
  variableId: string;
  noDecode: boolean;
  state: State;
}): Promise<VariablesExportInterface> {
  try {
    debugMessage({ message: `VariablesOps.exportVariable: start`, state });
    const exportData = createVariablesExportTemplate({ state });
    const variable = await _getVariable({ variableId, state });
    if (!noDecode) {
      variable.value = decode(variable.valueBase64);
    }
    exportData.variables[variable._id] = variable;
    debugMessage({ message: `VariablesOps.exportVariable: end`, state });
    return exportData;
  } catch (error) {
    throw new FrodoError(`Error exporting variable ${variableId}`, error);
  }
}

export async function exportVariables({
  noDecode,
  state,
}: {
  noDecode: boolean;
  state: State;
}): Promise<VariablesExportInterface> {
  try {
    debugMessage({ message: `VariablesOps.exportVariables: start`, state });
    const exportData = createVariablesExportTemplate({ state });
    const variables = await readVariables({ state });
    const indicatorId = createProgressIndicator({
      total: variables.length,
      message: 'Exporting variables...',
      state,
    });
    for (const variable of variables) {
      updateProgressIndicator({
        id: indicatorId,
        message: `Exporting variable ${variable._id}`,
        state,
      });
      if (!noDecode) {
        variable.value = decode(variable.valueBase64);
      }
      exportData.variables[variable._id] = variable;
    }
    stopProgressIndicator({
      id: indicatorId,
      message: `Exported ${variables.length} variables.`,
      state,
    });
    debugMessage({ message: `VariablesOps.exportVariables: end`, state });
    return exportData;
  } catch (error) {
    throw new FrodoError(`Error exporting variables`, error);
  }
}

/**
 * Import variable
 * @param {string} variableId variable id/name
 * @param {VariablesExportInterface} importData import data
 * @returns {Promise<VariableSkeleton[]>} array of imported variable objects
 */
export async function importVariable({
  variableId,
  importData,
  state,
}: {
  variableId: string;
  importData: VariablesExportInterface;
  state: State;
}): Promise<VariableSkeleton> {
  let response = null;
  const errors = [];
  const imported = [];
  for (const id of Object.keys(importData.variables)) {
    if (id === variableId || !variableId) {
      try {
        const variableData = importData.variables[id];
        delete variableData._rev;
        try {
          response = await updateVariable({
            variableId: variableData._id,
            value: variableData.valueBase64,
            description: variableData.description,
            expressionType: variableData.expressionType,
            state,
          });
          imported.push(id);
        } catch (error) {
          errors.push(error);
        }
      } catch (error) {
        errors.push(error);
      }
    }
  }
  if (errors.length > 0) {
    throw new FrodoError(`Error importing variable ${variableId}`, errors);
  }
  if (0 === imported.length) {
    throw new FrodoError(`Variable ${variableId} not found in import data`);
  }
  return response;
}

/**
 * Import variables
 * @param {VariablesExportInterface} importData import data
 * @returns {Promise<VariableSkeleton[]>} array of imported variable objects
 */
export async function importVariables({
  importData,
  state,
}: {
  importData: VariablesExportInterface;
  state: State;
}): Promise<VariableSkeleton[]> {
  const response = [];
  const errors = [];
  for (const id of Object.keys(importData.variables)) {
    try {
      const variableData = importData.variables[id];
      delete variableData._rev;
      try {
        response.push(
          await updateVariable({
            variableId: variableData._id,
            value: variableData.valueBase64,
            description: variableData.description,
            expressionType: variableData.expressionType,
            state,
          })
        );
      } catch (error) {
        errors.push(error);
      }
    } catch (error) {
      errors.push(error);
    }
  }
  if (errors.length > 0) {
    throw new FrodoError(`Error importing variables`, errors);
  }
  return response;
}

export async function createVariable({
  variableId,
  value,
  description,
  expressionType,
  state,
}: {
  variableId: string;
  value: string;
  description?: string;
  expressionType?: VariableExpressionType;
  state: State;
}): Promise<VariableSkeleton> {
  debugMessage({
    message: `VariablesOps.createVariable: start`,
    state,
  });
  try {
    await _getVariable({ variableId, state });
  } catch (error) {
    try {
      const result = await _putVariable({
        variableId,
        value,
        description,
        expressionType,
        state,
      });
      debugMessage({
        message: `VariablesOps.createVariable: end`,
        state,
      });
      return result;
    } catch (error) {
      throw new FrodoError(`Error creating variable ${variableId}`, error);
    }
  }
  throw new FrodoError(`Variable ${variableId} already exists`);
}

export async function updateVariable({
  variableId,
  value,
  description,
  expressionType,
  state,
}: {
  variableId: string;
  value: string;
  description?: string;
  expressionType?: VariableExpressionType;
  state: State;
}): Promise<VariableSkeleton> {
  try {
    return _putVariable({
      variableId,
      value,
      description,
      expressionType,
      state,
    });
  } catch (error) {
    throw new FrodoError(`Error updating variable ${variableId}`, error);
  }
}

export async function updateVariableDescription({
  variableId,
  description,
  state,
}: {
  variableId: string;
  description: string;
  state: State;
}): Promise<any> {
  try {
    return _setVariableDescription({
      variableId,
      description,
      state,
    });
  } catch (error) {
    throw new FrodoError(
      `Error updating description of variable ${variableId}`,
      error
    );
  }
}

export async function deleteVariable({
  variableId,
  state,
}: {
  variableId: string;
  state: State;
}): Promise<VariableSkeleton> {
  try {
    return _deleteVariable({ variableId, state });
  } catch (error) {
    throw new FrodoError(`Error deleting variable ${variableId}`, error);
  }
}
